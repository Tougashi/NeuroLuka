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
                'wound_type' => 'required|string|in:luka_goresan,luka_lecet,luka_bakar,luka_terpotong,luka_terbuka',
            ]);

            $image = $request->file('image');
            $woundType = $request->input('wound_type');

            // Debug log
            Log::info('Received wound type', [
                'wound_type' => $woundType,
                'request_data' => $request->all()
            ]);

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
                Log::info('Creating wound record', [
                    'wound_type' => $woundType,
                    'user_id' => Auth::id()
                ]);

                $woundRecord = WoundRecord::create([
                    'user_id' => Auth::id(),
                    'original_image' => $originalPath,
                    'segmentation_image' => $segmentationPath,
                    'area_cm2' => $result['area_cm2'] ?? 0,
                    'confidence' => $result['confidence'] ?? 0,
                    'wound_type' => $woundType,
                    'analyzed_at' => now(),
                ]);

                Log::info('Wound record created', [
                    'record_id' => $woundRecord->id,
                    'wound_type' => $woundRecord->wound_type
                ]);
            }

            $area = $result['area_cm2'] ?? 0;
            $woundTypeInfo = $result['wound_types'][$woundType] ?? null;

            // Calculate recovery time based on wound type and area
            $baseRecoveryDays = max(7, $area * 2);
            $recoveryFactor = $woundTypeInfo['recovery_factor'] ?? 1.0;
            $totalRecoveryDays = $baseRecoveryDays * $recoveryFactor;

            $recoveryTime = '';
            if ($totalRecoveryDays <= 14) {
                $recoveryTime = '1-2 minggu';
            } elseif ($totalRecoveryDays <= 21) {
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
                    'wound_type' => $woundTypeInfo['name'] ?? $woundType,
                    'recommendations' => $woundTypeInfo['recommendations'] ?? [],
                    'original_image_url' => Storage::url($originalPath),
                    'segmentation_image_url' => $segmentationPath ? Storage::url($segmentationPath) : null,
                    'area_recovery_time' => $baseRecoveryDays . ' hari',
                    'total_recovery_time' => $totalRecoveryDays . ' hari'
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
