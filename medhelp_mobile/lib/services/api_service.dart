import 'dart:convert';
import 'package:http/http.dart' as http;

// Android emulator → 10.0.2.2
// iOS simulator   → 127.0.0.1
// Real device     → your machine's local IP, e.g. 192.168.1.42
const String _base = 'http://10.0.2.2:3000';

class ApiException implements Exception {
  final String message;
  final int? statusCode;
  ApiException(this.message, {this.statusCode});

  @override
  String toString() => message;
}

Map<String, String> _headers({String? token}) {
  final h = {'Content-Type': 'application/json'};
  if (token != null) h['Authorization'] = 'Bearer $token';
  return h;
}

dynamic _parse(http.Response res) {
  final body = jsonDecode(res.body);
  if (res.statusCode >= 400) {
    final msg = body['error'] ?? body['message'] ?? 'Request failed';
    throw ApiException(msg.toString(), statusCode: res.statusCode);
  }
  return body;
}

class ApiService {
  // --- Auth ---

  static Future<String> login(String email, String password) async {
    final res = await http.post(
      Uri.parse('$_base/login'),
      headers: _headers(),
      body: jsonEncode({'email': email, 'password': password}),
    );
    final data = _parse(res);
    return data['token'] as String;
  }

  static Future<void> register(Map<String, dynamic> userData) async {
    final res = await http.post(
      Uri.parse('$_base/register'),
      headers: _headers(),
      body: jsonEncode(userData),
    );
    _parse(res);
  }

  static Future<Map<String, dynamic>> getProfile(String token) async {
    final res = await http.get(
      Uri.parse('$_base/profile'),
      headers: _headers(token: token),
    );
    return _parse(res) as Map<String, dynamic>;
  }

  // --- Triage Chat ---

  static Future<Map<String, dynamic>> chat(String email, String message, String token) async {
    final res = await http.post(
      Uri.parse('$_base/ai/chat'),
      headers: _headers(token: token),
      body: jsonEncode({'email': email, 'message': message}),
    );
    return _parse(res) as Map<String, dynamic>;
  }

  static Future<void> resetChat(String email, String token) async {
    final res = await http.post(
      Uri.parse('$_base/ai/reset'),
      headers: _headers(token: token),
      body: jsonEncode({'email': email}),
    );
    _parse(res);
  }
}