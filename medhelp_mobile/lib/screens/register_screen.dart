import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailCtrl = TextEditingController();
  final _passwordCtrl = TextEditingController();
  final _firstNameCtrl = TextEditingController();
  final _lastNameCtrl = TextEditingController();
  final _dobCtrl = TextEditingController();
  final _addressCtrl = TextEditingController();
  final _phoneCtrl = TextEditingController();
  final _weightCtrl = TextEditingController();
  final _heightCtrl = TextEditingController();
  final _countryCtrl = TextEditingController();
  final _prevCondCtrl = TextEditingController();
  final _famCondCtrl = TextEditingController();
  String _sex = 'Male';
  bool _obscure = true;

  @override
  void dispose() {
    for (final c in [
      _emailCtrl, _passwordCtrl, _firstNameCtrl, _lastNameCtrl,
      _dobCtrl, _addressCtrl, _phoneCtrl, _weightCtrl, _heightCtrl,
      _countryCtrl, _prevCondCtrl, _famCondCtrl,
    ]) {
      c.dispose();
    }
    super.dispose();
  }

  Future<void> _pickDate() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: DateTime(1990),
      firstDate: DateTime(1900),
      lastDate: DateTime.now(),
    );
    if (picked != null) {
      _dobCtrl.text = picked.toIso8601String().split('T').first;
    }
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    final auth = context.read<AuthProvider>();
    final ok = await auth.register({
      'email': _emailCtrl.text.trim(),
      'password': _passwordCtrl.text,
      'firstName': _firstNameCtrl.text.trim(),
      'lastName': _lastNameCtrl.text.trim(),
      'dateOfBirth': _dobCtrl.text.trim(),
      'address': _addressCtrl.text.trim(),
      'phoneNumber': _phoneCtrl.text.trim(),
      'weight': double.tryParse(_weightCtrl.text) ?? 0,
      'height': double.tryParse(_heightCtrl.text) ?? 0,
      'country': _countryCtrl.text.trim(),
      'sex': _sex,
      'previousConditions': _prevCondCtrl.text.trim(),
      'familyConditions': _famCondCtrl.text.trim(),
    });
    if (!mounted) return;
    if (ok) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Account created! Please login.')),
      );
      Navigator.pushReplacementNamed(context, '/login');
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(auth.error ?? 'Registration failed')),
      );
    }
  }

  Widget _field(TextEditingController ctrl, String label,
      {TextInputType? keyboard,
      String? Function(String?)? validator,
      Widget? suffix,
      bool readOnly = false,
      VoidCallback? onTap,
      int maxLines = 1}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 14),
      child: TextFormField(
        controller: ctrl,
        keyboardType: keyboard,
        readOnly: readOnly,
        onTap: onTap,
        maxLines: maxLines,
        decoration: InputDecoration(labelText: label, suffixIcon: suffix),
        validator: validator ??
            (v) => (v == null || v.trim().isEmpty) ? 'Required' : null,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final loading = context.watch<AuthProvider>().loading;
    return Scaffold(
      appBar: AppBar(title: const Text('Create Account')),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                _field(_firstNameCtrl, 'First Name'),
                _field(_lastNameCtrl, 'Last Name'),
                _field(_emailCtrl, 'Email',
                    keyboard: TextInputType.emailAddress,
                    validator: (v) =>
                        (v == null || !v.contains('@')) ? 'Valid email required' : null),
                Padding(
                  padding: const EdgeInsets.only(bottom: 14),
                  child: TextFormField(
                    controller: _passwordCtrl,
                    obscureText: _obscure,
                    decoration: InputDecoration(
                      labelText: 'Password (min 8 chars)',
                      suffixIcon: IconButton(
                        icon: Icon(_obscure ? Icons.visibility_off : Icons.visibility),
                        onPressed: () => setState(() => _obscure = !_obscure),
                      ),
                    ),
                    validator: (v) => (v == null || v.length < 8)
                        ? 'At least 8 characters'
                        : null,
                  ),
                ),
                _field(_dobCtrl, 'Date of Birth (YYYY-MM-DD)',
                    readOnly: true,
                    onTap: _pickDate,
                    suffix: const Icon(Icons.calendar_today_outlined)),
                _field(_phoneCtrl, 'Phone (10 digits)',
                    keyboard: TextInputType.phone,
                    validator: (v) =>
                        (v == null || !RegExp(r'^[0-9]{10}$').hasMatch(v))
                            ? '10-digit phone required'
                            : null),
                _field(_addressCtrl, 'Address', maxLines: 2),
                _field(_countryCtrl, 'Country'),
                Row(
                  children: [
                    Expanded(
                        child: _field(_weightCtrl, 'Weight (kg)',
                            keyboard: TextInputType.number,
                            validator: (v) =>
                                (double.tryParse(v ?? '') == null)
                                    ? 'Invalid'
                                    : null)),
                    const SizedBox(width: 12),
                    Expanded(
                        child: _field(_heightCtrl, 'Height (cm)',
                            keyboard: TextInputType.number,
                            validator: (v) =>
                                (double.tryParse(v ?? '') == null)
                                    ? 'Invalid'
                                    : null)),
                  ],
                ),
                Padding(
                  padding: const EdgeInsets.only(bottom: 14),
                  child: DropdownButtonFormField<String>(
                    initialValue: _sex,
                    decoration: const InputDecoration(labelText: 'Sex'),
                    items: ['Male', 'Female', 'Other']
                        .map((s) => DropdownMenuItem(value: s, child: Text(s)))
                        .toList(),
                    onChanged: (v) => setState(() => _sex = v!),
                  ),
                ),
                _field(_prevCondCtrl, 'Previous Conditions (optional)',
                    validator: (_) => null, maxLines: 2),
                _field(_famCondCtrl, 'Family Conditions (optional)',
                    validator: (_) => null, maxLines: 2),
                const SizedBox(height: 8),
                FilledButton(
                  onPressed: loading ? null : _submit,
                  child: loading
                      ? const SizedBox(
                          height: 20,
                          width: 20,
                          child: CircularProgressIndicator(
                              strokeWidth: 2, color: Colors.white))
                      : const Text('Register'),
                ),
                const SizedBox(height: 16),
                TextButton(
                  onPressed: () => Navigator.pushReplacementNamed(context, '/login'),
                  child: const Text('Already have an account? Login'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
