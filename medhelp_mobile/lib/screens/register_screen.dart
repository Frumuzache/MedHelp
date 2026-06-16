import 'package:flutter/material.dart';
import '../services/api_service.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _formKey = GlobalKey<FormState>();
  bool _loading = false;
  String? _error;

  final _emailCtrl = TextEditingController();
  final _firstNameCtrl = TextEditingController();
  final _lastNameCtrl = TextEditingController();
  final _passwordCtrl = TextEditingController();
  final _addressCtrl = TextEditingController();
  final _phoneCtrl = TextEditingController();
  final _weightCtrl = TextEditingController();
  final _heightCtrl = TextEditingController();
  final _countryCtrl = TextEditingController();
  final _prevCondCtrl = TextEditingController();
  final _famCondCtrl = TextEditingController();

  DateTime? _dob;
  String? _sex;

  @override
  void dispose() {
    for (final c in [_emailCtrl, _firstNameCtrl, _lastNameCtrl, _passwordCtrl,
        _addressCtrl, _phoneCtrl, _weightCtrl, _heightCtrl, _countryCtrl,
        _prevCondCtrl, _famCondCtrl]) {
      c.dispose();
    }
    super.dispose();
  }

  Future<void> _pickDate() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: DateTime(1995),
      firstDate: DateTime(1900),
      lastDate: DateTime.now(),
    );
    if (picked != null) setState(() => _dob = picked);
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    if (_dob == null) {
      setState(() => _error = 'Please select your date of birth');
      return;
    }
    if (_sex == null) {
      setState(() => _error = 'Please select your sex');
      return;
    }

    setState(() { _loading = true; _error = null; });

    try {
      await ApiService.register({
        'email': _emailCtrl.text.trim(),
        'firstName': _firstNameCtrl.text.trim(),
        'lastName': _lastNameCtrl.text.trim(),
        'password': _passwordCtrl.text,
        'dateOfBirth': _dob!.toIso8601String(),
        'address': _addressCtrl.text.trim(),
        'phoneNumber': _phoneCtrl.text.trim(),
        'weight': double.parse(_weightCtrl.text.trim()),
        'height': double.parse(_heightCtrl.text.trim()),
        'country': _countryCtrl.text.trim(),
        'sex': _sex,
        'previousConditions': _prevCondCtrl.text.trim(),
        'familyConditions': _famCondCtrl.text.trim(),
      });

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Account created! Please log in.')),
        );
        Navigator.pushReplacementNamed(context, '/login');
      }
    } catch (e) {
      setState(() => _error = e.toString());
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Widget _field(String label, TextEditingController ctrl, {
    TextInputType? type,
    String? Function(String?)? validator,
    int maxLines = 1,
  }) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: TextFormField(
        controller: ctrl,
        keyboardType: type,
        maxLines: maxLines,
        decoration: InputDecoration(labelText: label),
        validator: validator ?? (v) => (v == null || v.trim().isEmpty) ? 'Required' : null,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FB),
      appBar: AppBar(
        title: const Text('Create Account'),
        backgroundColor: const Color(0xFF0056B3),
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              _field('Email', _emailCtrl,
                type: TextInputType.emailAddress,
                validator: (v) => (v == null || !v.contains('@')) ? 'Enter a valid email' : null,
              ),
              _field('First Name', _firstNameCtrl),
              _field('Last Name', _lastNameCtrl),
              _field('Password', _passwordCtrl,
                validator: (v) => (v == null || v.length < 8) ? 'Minimum 8 characters' : null,
              ),

              // Date of birth picker
              Padding(
                padding: const EdgeInsets.only(bottom: 16),
                child: OutlinedButton.icon(
                  onPressed: _pickDate,
                  icon: const Icon(Icons.calendar_today),
                  label: Text(_dob == null
                    ? 'Select Date of Birth'
                    : 'Born: ${_dob!.day}/${_dob!.month}/${_dob!.year}'),
                  style: OutlinedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    side: const BorderSide(color: Color(0xFF0056B3)),
                  ),
                ),
              ),

              // Sex dropdown
              Padding(
                padding: const EdgeInsets.only(bottom: 16),
                child: DropdownButtonFormField<String>(
                  value: _sex,
                  decoration: const InputDecoration(labelText: 'Sex'),
                  items: ['Male', 'Female', 'Other']
                      .map((s) => DropdownMenuItem(value: s, child: Text(s)))
                      .toList(),
                  onChanged: (v) => setState(() => _sex = v),
                  validator: (v) => v == null ? 'Required' : null,
                ),
              ),

              _field('Phone Number (10 digits)', _phoneCtrl,
                type: TextInputType.phone,
                validator: (v) => (v == null || !RegExp(r'^\d{10}$').hasMatch(v.trim()))
                    ? 'Enter a 10-digit phone number' : null,
              ),
              _field('Address', _addressCtrl),
              _field('Country', _countryCtrl),
              _field('Weight (kg)', _weightCtrl,
                type: TextInputType.number,
                validator: (v) => (v == null || double.tryParse(v) == null) ? 'Enter a number' : null,
              ),
              _field('Height (cm)', _heightCtrl,
                type: TextInputType.number,
                validator: (v) => (v == null || double.tryParse(v) == null) ? 'Enter a number' : null,
              ),
              _field('Previous Conditions (optional)', _prevCondCtrl,
                maxLines: 2,
                validator: (_) => null,
              ),
              _field('Family Conditions (optional)', _famCondCtrl,
                maxLines: 2,
                validator: (_) => null,
              ),

              if (_error != null)
                Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: Text(_error!, style: const TextStyle(color: Colors.red)),
                ),

              FilledButton(
                onPressed: _loading ? null : _submit,
                style: FilledButton.styleFrom(
                  backgroundColor: const Color(0xFF0056B3),
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                ),
                child: _loading
                    ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                    : const Text('Create Account', style: TextStyle(fontSize: 16)),
              ),

              const SizedBox(height: 16),
              TextButton(
                onPressed: () => Navigator.pop(context),
                child: const Text('Already have an account? Sign In'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}