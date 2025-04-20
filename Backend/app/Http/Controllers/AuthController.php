<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    //menampilkan halaman login
    public function showLogin()
    {
        return view('Auth.login');
    }
    //menampilkan halaman register
    public function showRegister()
    {
        return view('auth.register');
    }

    //proses register
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
        ]);

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return redirect()->route('login')->with('success','Registrasi Berhasil');
    }

    //proses login
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($request->only('email', 'password'))) {
            return redirect()->route('products.index')->with('success', 'Login berhasil!');
        }

        return back()->with('error','Email dan Password tidak sesuai');
    }

    public function logout()
    {
        Auth::logout();
        return redirect()->route('login')->with('success','Logout Berhasil');
    }
}
