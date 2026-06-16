import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../providers/chat_provider.dart';
import '../widgets/chat_bubble.dart';

class ChatScreen extends StatefulWidget {
  const ChatScreen({super.key});

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final _inputCtrl = TextEditingController();
  final _scrollCtrl = ScrollController();

  @override
  void dispose() {
    _inputCtrl.dispose();
    _scrollCtrl.dispose();
    super.dispose();
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollCtrl.hasClients) {
        _scrollCtrl.animateTo(
          _scrollCtrl.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  Future<void> _send() async {
    final text = _inputCtrl.text.trim();
    if (text.isEmpty) return;
    _inputCtrl.clear();

    final auth = context.read<AuthProvider>();
    await context.read<ChatProvider>().sendMessage(
      auth.email!,
      text,
      auth.token!,
    );
    _scrollToBottom();
  }

  Future<void> _reset() async {
    final auth = context.read<AuthProvider>();
    await context.read<ChatProvider>().reset(auth.email!, auth.token!);
  }

  @override
  Widget build(BuildContext context) {
    final chat = context.watch<ChatProvider>();

    if (chat.messages.isNotEmpty) _scrollToBottom();

    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FB),
      appBar: AppBar(
        title: const Text('Triage Chat'),
        backgroundColor: const Color(0xFF0056B3),
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            tooltip: 'New Session',
            onPressed: _reset,
          ),
        ],
      ),
      body: Column(
        children: [
          // Messages list
          Expanded(
            child: chat.messages.isEmpty
                ? const Center(
                    child: Padding(
                      padding: EdgeInsets.all(32),
                      child: Text(
                        'Describe your symptoms to begin the triage.',
                        textAlign: TextAlign.center,
                        style: TextStyle(color: Colors.grey, fontSize: 16),
                      ),
                    ),
                  )
                : ListView.builder(
                    controller: _scrollCtrl,
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    itemCount: chat.messages.length,
                    itemBuilder: (_, i) => ChatBubble(message: chat.messages[i]),
                  ),
          ),

          // Typing indicator
          if (chat.isLoading)
            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 20, vertical: 8),
              child: Row(
                children: [
                  SizedBox(
                    width: 20, height: 20,
                    child: CircularProgressIndicator(strokeWidth: 2, color: Color(0xFF0056B3)),
                  ),
                  SizedBox(width: 10),
                  Text('AI is thinking...', style: TextStyle(color: Colors.grey)),
                ],
              ),
            ),

          // Error
          if (chat.error != null)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
              child: Text(chat.error!, style: const TextStyle(color: Colors.red, fontSize: 12)),
            ),

          // Diagnosis complete banner
          if (chat.isFinal)
            Container(
              width: double.infinity,
              color: const Color(0xFFD4EDDA),
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
              child: Row(
                children: [
                  const Icon(Icons.check_circle, color: Color(0xFF155724), size: 20),
                  const SizedBox(width: 8),
                  const Expanded(
                    child: Text('Diagnosis complete.', style: TextStyle(color: Color(0xFF155724), fontWeight: FontWeight.w600)),
                  ),
                  TextButton(
                    onPressed: _reset,
                    child: const Text('New Session'),
                  ),
                ],
              ),
            ),

          // Input bar
          if (!chat.isFinal)
            SafeArea(
              child: Container(
                decoration: const BoxDecoration(
                  color: Colors.white,
                  border: Border(top: BorderSide(color: Color(0xFFDDDDDD))),
                ),
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                child: Row(
                  children: [
                    Expanded(
                      child: TextField(
                        controller: _inputCtrl,
                        decoration: InputDecoration(
                          hintText: 'Type your message...',
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(24)),
                          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                        ),
                        onSubmitted: (_) => _send(),
                        enabled: !chat.isLoading,
                      ),
                    ),
                    const SizedBox(width: 8),
                    IconButton.filled(
                      onPressed: chat.isLoading ? null : _send,
                      icon: const Icon(Icons.send),
                      style: IconButton.styleFrom(backgroundColor: const Color(0xFF0056B3)),
                    ),
                  ],
                ),
              ),
            ),
        ],
      ),
    );
  }
}