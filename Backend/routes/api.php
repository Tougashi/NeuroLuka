<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/data', function () {
    return response()->json([
        ['id' => 1, 'name' => 'Item 1'],
        ['id' => 2, 'name' => 'Item 2'],
    ]);
});

Route::post('/data', function (Request $request) {
    // Ambil data dari request
    $name = $request->input('name');
    $description = $request->input('description');

    // Simpan data atau lakukan sesuatu
    return response()->json([
        'message' => 'Data berhasil diterima',
        'data' => [
            'name' => $name,
            'description' => $description,
        ],
    ]);
});
