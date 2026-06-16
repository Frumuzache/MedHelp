import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../providers/chat_provider.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final name = auth.firstName ?? 'User';

    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FB),
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Header
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 28),
              decoration: const BoxDecoration(
                color: Color(0xFF0056B3),
                borderRadius: BorderRadius.vertical(bottom: Radius.circular(24)),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Hello, $name', style: const TextStyle(
                        color: Colors.white, fontSize: 22, fontWeight: FontWeight.bold,
                      )),
                      const SizedBox(height: 4),
                      const Text('How can MedHelp assist you today?',
                        style: TextStyle(color: Colors.white70, fontSize: 14)),
                    ],
                  ),
                  IconButton(
                    icon: const Icon(Icons.logout, color: Colors.white),
                    onPressed: () async {
                      await context.read<ChatProvider>().reset(auth.email!, auth.token!);
                      await context.read<AuthProvider>().logout();
                      if (context.mounted) Navigator.pushReplacementNamed(context, '/login');
                    },
                  ),
                ],
              ),
            ),

            const SizedBox(height: 32),

            // Cards
            Expanded(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: Column(
                  children: [
                    _DashboardCard(
                      icon: Icons.chat_bubble_outline,
                      title: 'Start Triage',
                      subtitle: 'Chat with our AI assistant to analyze symptoms and get immediate advice.',
                      color: const Color(0xFF0056B3),
                      onTap: () => Navigator.pushNamed(context, '/chat'),
                    ),
                    const SizedBox(height: 16),
                    _DashboardCard(
                      icon: Icons.info_outline,
                      title: 'About MedHelp',
                      subtitle: 'MedHelp uses AI to help triage your symptoms. Always consult a real doctor for medical decisions.',
                      color: const Color(0xFF5C6BC0),
                      onTap: () => showDialog(
                        context: context,
                        builder: (_) => AlertDialog(
                          title: const Text('About MedHelp'),
                          content: const Text(
                            'MedHelp is an AI-powered triage assistant. It asks targeted questions about your symptoms and provides a preliminary assessment.\n\nThis is not a substitute for professional medical advice.',
                          ),
                          actions: [
                            TextButton(onPressed: () => Navigator.pop(context), child: const Text('OK')),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // Disclaimer
            const Padding(
              padding: EdgeInsets.all(20),
              child: Text(
                'MedHelp is not a substitute for professional medical advice, diagnosis, or treatment.',
                textAlign: TextAlign.center,
                style: TextStyle(color: Colors.grey, fontSize: 11),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _DashboardCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final Color color;
  final VoidCallback onTap;

  const _DashboardCard({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: color.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(icon, color: color, size: 28),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                    const SizedBox(height: 4),
                    Text(subtitle, style: const TextStyle(color: Colors.grey, fontSize: 13, height: 1.4)),
                  ],
                ),
              ),
              const Icon(Icons.chevron_right, color: Colors.grey),
            ],
          ),
        ),
      ),
    );
  }
}