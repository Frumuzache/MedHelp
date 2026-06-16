import 'package:flutter/material.dart';
import '../providers/chat_provider.dart';

class ChatBubble extends StatelessWidget {
  final ChatMessage message;

  const ChatBubble({super.key, required this.message});

  @override
  Widget build(BuildContext context) {
    final isUser = message.isUser;
    final isFinalDiagnosis = !isUser && message.text.startsWith('FINAL DIAGNOSIS:');

    return Align(
      alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.only(bottom: 10),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
        constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.78),
        decoration: BoxDecoration(
          color: isUser
              ? const Color(0xFF0056B3)
              : isFinalDiagnosis
                  ? const Color(0xFFD4EDDA)
                  : Colors.white,
          borderRadius: BorderRadius.only(
            topLeft: const Radius.circular(16),
            topRight: const Radius.circular(16),
            bottomLeft: isUser ? const Radius.circular(16) : Radius.zero,
            bottomRight: isUser ? Radius.zero : const Radius.circular(16),
          ),
          boxShadow: [
            BoxShadow(color: Colors.black.withOpacity(0.06), blurRadius: 4, offset: const Offset(0, 2)),
          ],
          border: isFinalDiagnosis ? Border.all(color: const Color(0xFF155724), width: 1) : null,
        ),
        child: Text(
          message.text,
          style: TextStyle(
            color: isUser
                ? Colors.white
                : isFinalDiagnosis
                    ? const Color(0xFF155724)
                    : Colors.black87,
            fontSize: 15,
            height: 1.4,
          ),
        ),
      ),
    );
  }
}