import 'package:flutter/material.dart';
import '../services/api_service.dart';

class ChatMessage {
  final String text;
  final bool isUser;
  final DateTime timestamp;

  ChatMessage({required this.text, required this.isUser})
      : timestamp = DateTime.now();
}

class ChatProvider extends ChangeNotifier {
  final List<ChatMessage> _messages = [];
  bool _isFinal = false;
  bool _isLoading = false;
  String? _error;

  List<ChatMessage> get messages => List.unmodifiable(_messages);
  bool get isFinal => _isFinal;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> sendMessage(String email, String text, String token) async {
    if (_isFinal || _isLoading) return;

    _messages.add(ChatMessage(text: text, isUser: true));
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final res = await ApiService.chat(email, text, token);
      _messages.add(ChatMessage(text: res['reply'] as String, isUser: false));
      _isFinal = res['isFinal'] == true;
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> reset(String email, String token) async {
    try {
      await ApiService.resetChat(email, token);
    } catch (_) {}
    _messages.clear();
    _isFinal = false;
    _isLoading = false;
    _error = null;
    notifyListeners();
  }
}