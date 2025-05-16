<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\WoundRecord;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class WoundAnalysisController extends Controller
{
    private const MAX_FILE_SIZE = 5242880; // 5MB in bytes
    private const ALLOWED_MIMES = ['image/jpeg', 'image/jpg', 'image/pjpeg', 'image/png', 'image/gif'];
    private const FASTAPI_URL = 'http://127.0.0.1:8090';

    public function analyze(Request $request)
    {
        try {
            // Validate request
            $request->validate([
                'image' => 'required|file|mimes:jpeg,jpg,png,gif|max:5120', // 5MB max
            ]);

            $image = $request->file('image');

            // Store original image
            $originalName = Str::random(40) . '.' . $image->getClientOriginalExtension();
            $originalPath = $image->storeAs('wounds/original', $originalName, 'public');

            // Log the API call
            Log::info('Sending image to FastAPI for analysis', [
                'originalPath' => $originalPath
            ]);

            // Send to FastAPI
            $response = Http::timeout(30)
                ->attach('file', fopen($image->getRealPath(), 'r'), $image->getClientOriginalName())
                ->post(self::FASTAPI_URL . '/predict');

            if (!$response->successful()) {
                Log::error('FastAPI Error', [
                    'status' => $response->status(),
                    'response' => $response->body()
                ]);
                throw new \Exception('Error processing image: ' . $response->body());
            }

            $result = $response->json();

            // Save segmentation image if provided
            $segmentationPath = null;
            if (isset($result['segmentation_image'])) {
                $segmentationName = Str::random(40) . '.png';
                $segmentationPath = 'wounds/segmentation/' . $segmentationName;
                Storage::disk('public')->put(
                    $segmentationPath,
                    base64_decode($result['segmentation_image'])
                );
            }

            // Store record in database if user is logged in
            if (Auth::check()) {
                $woundRecord = WoundRecord::create([
                    'user_id' => Auth::id(),
                    'original_image' => $originalPath,
                    'segmentation_image' => $segmentationPath,
                    'area_cm2' => $result['area_cm2'] ?? 0,
                    'confidence' => $result['confidence'] ?? 0,
                    'analyzed_at' => now(),
                ]);
            }

            $area = $result['area_cm2'] ?? 0;
            $recoveryTime = '';
            if ($area < 10) {
                $recoveryTime = '1-2 minggu';
            } elseif ($area < 30) {
                $recoveryTime = '2-3 minggu';
            } else {
                $recoveryTime = '4-6 minggu';
            }

            // Return formatted response
            return response()->json([
                'success' => true,
                'data' => [
                    'area_cm2' => round($area, 2),
                    'perimeter_cm' => round($result['perimeter_cm'] ?? 0, 2),
                    'estimated_recovery_time' => $recoveryTime,
                    'confidence' => isset($result['confidence']) ? round($result['confidence'] * 100, 1) : null,
                    'tissue_analysis' => [
                        'Granulasi' => 60,
                        'Nekrosis' => 20,
                        'Jaringan Normal' => 20
                    ],
                    'recommendations' => [
                        'Bersihkan luka dengan air bersih atau larutan saline steril',
                        'Ganti perban setiap hari atau saat basah',
                        'Hindari aktivitas yang dapat mengganggu proses penyembuhan',
                        'Konsultasikan dengan tenaga medis jika ada tanda infeksi'
                    ],
                    'original_image_url' => Storage::url($originalPath),
                    'segmentation_image_url' => $segmentationPath ? Storage::url($segmentationPath) : null
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Wound Analysis Error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to analyze wound: ' . $e->getMessage(),
            ], 500);
        }
    }
}
