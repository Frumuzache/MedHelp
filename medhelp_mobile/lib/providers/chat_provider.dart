import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

const String _chatBaseUrl = 'http://10.61.109.211:3000';

class ChatMessage {
  final String text;
  final bool isUser;

  ChatMessage({required this.text, required this.isUser});
}

class ChatProvider extends ChangeNotifier {
  final List<ChatMessage> _messages = [];
  bool _loading = false;
  bool _isFinal = false;
  String? _error;

  List<ChatMessage> get messages => List.unmodifiable(_messages);
  bool get loading => _loading;
  bool get isFinal => _isFinal;
  String? get error => _error;

  Future<void> sendMessage(String email, String text) async {
    _messages.add(ChatMessage(text: text, isUser: true));
    _loading = true;
    _error = null;
    notifyListeners();

    try {
      final res = await http.post(
        Uri.parse('$_chatBaseUrl/ai/chat'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'email': email, 'message': text}),
      );
      if (res.statusCode == 200) {
        final data = jsonDecode(res.body);
        _messages.add(ChatMessage(text: data['reply'], isUser: false));
        _isFinal = data['isFinal'] ?? false;
      } else {
        _error = 'Server error ${res.statusCode}';
      }
    } catch (e) {
      _error = 'Network error: $e';
    }

    _loading = false;
    notifyListeners();
  }

  Future<void> reset(String email) async {
    try {
      await http.post(
        Uri.parse('$_chatBaseUrl/ai/reset'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'email': email}),
      );
    } catch (_) {}
    _messages.clear();
    _isFinal = false;
    _error = null;
    notifyListeners();
  }
}
