import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/api_service.dart';

class AuthProvider extends ChangeNotifier {
  String? _token;
  String? _email;
  String? _firstName;

  String? get token => _token;
  String? get email => _email;
  String? get firstName => _firstName;
  bool get isLoggedIn => _token != null;

  Future<void> loadFromStorage() async {
    final prefs = await SharedPreferences.getInstance();
    _token = prefs.getString('token');
    _email = prefs.getString('email');
    _firstName = prefs.getString('firstName');
    notifyListeners();
  }

  Future<void> login(String email, String password) async {
    final token = await ApiService.login(email, password);
    _token = token;
    _email = email;

    final profile = await ApiService.getProfile(token);
    _firstName = profile['firstName'] as String?;

    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('token', token);
    await prefs.setString('email', email);
    await prefs.setString('firstName', _firstName ?? '');

    notifyListeners();
  }

  Future<void> logout() async {
    _token = null;
    _email = null;
    _firstName = null;
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();
    notifyListeners();
  }
}