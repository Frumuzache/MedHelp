import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

const String _baseUrl = 'http://10.61.109.211:3000';

class AuthProvider extends ChangeNotifier {
  String? _token;
  Map<String, dynamic>? _profile;
  String? _error;
  bool _loading = false;

  String? get token => _token;
  Map<String, dynamic>? get profile => _profile;
  String? get error => _error;
  bool get loading => _loading;
  bool get isLoggedIn => _token != null;

  AuthProvider() {
    _loadToken();
  }

  Future<void> _loadToken() async {
    final prefs = await SharedPreferences.getInstance();
    _token = prefs.getString('token');
    if (_token != null) await fetchProfile();
    notifyListeners();
  }

  Future<bool> login(String email, String password) async {
    _loading = true;
    _error = null;
    notifyListeners();
    try {
      final res = await http.post(
        Uri.parse('$_baseUrl/login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'email': email, 'password': password}),
      );
      if (res.statusCode == 200) {
        final data = jsonDecode(res.body);
        _token = data['token'];
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('token', _token!);
        await fetchProfile();
        _loading = false;
        notifyListeners();
        return true;
      } else {
        _error = res.body.isNotEmpty ? res.body : 'Login failed';
        _loading = false;
        notifyListeners();
        return false;
      }
    } catch (e) {
      _error = 'Network error: $e';
      _loading = false;
      notifyListeners();
      return false;
    }
  }

  Future<bool> register(Map<String, dynamic> data) async {
    _loading = true;
    _error = null;
    notifyListeners();
    try {
      final res = await http.post(
        Uri.parse('$_baseUrl/register'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(data),
      );
      _loading = false;
      if (res.statusCode == 201) {
        notifyListeners();
        return true;
      } else {
        final body = jsonDecode(res.body);
        _error = body['message'] ?? body['error'] ?? 'Registration failed';
        notifyListeners();
        return false;
      }
    } catch (e) {
      _error = 'Network error: $e';
      _loading = false;
      notifyListeners();
      return false;
    }
  }

  Future<void> fetchProfile() async {
    if (_token == null) return;
    try {
      final res = await http.get(
        Uri.parse('$_baseUrl/profile'),
        headers: {'Authorization': 'Bearer $_token'},
      );
      if (res.statusCode == 200) {
        _profile = jsonDecode(res.body);
        notifyListeners();
      }
    } catch (_) {}
  }

  Future<void> logout() async {
    _token = null;
    _profile = null;
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('token');
    notifyListeners();
  }
}
