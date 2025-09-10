// Validation utility functions for patient data forms

export const validateRequired = (value, fieldName) => {
  const stringValue = String(value).trim();
  if (!value || stringValue === '') {
    return `${fieldName} wajib diisi`;
  }
  return null;
};

export const validateNIK = (nik) => {
  if (!nik) return 'NIK wajib diisi';

  // Remove any non-digit characters
  const cleanNIK = nik.replace(/\D/g, '');

  // Check if it's exactly 16 digits
  if (cleanNIK.length !== 16) {
    return 'NIK harus terdiri dari 16 digit';
  }

  // Basic NIK format validation (Indonesian NIK structure)
  // First 6 digits should be valid date (DDMMYY)
  const datePart = cleanNIK.substring(0, 6);
  const day = parseInt(datePart.substring(0, 2));
  const month = parseInt(datePart.substring(2, 4));
  const year = parseInt(datePart.substring(4, 6));

  if (day < 1 || day > 31 || month < 1 || month > 12) {
    return 'Format NIK tidak valid (tanggal/bulan tidak valid)';
  }

  return null;
};

export const validateEmail = (email) => {
  if (!email) return null; // Email is optional

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Format email tidak valid';
  }
  return null;
};

export const validatePhone = (phone) => {
  if (!phone) return 'Nomor telepon wajib diisi';

  // Remove any non-digit characters except +
  const cleanPhone = phone.replace(/[^\d+]/g, '');

  // Check if it starts with +62 or 0 or 62
  if (!cleanPhone.match(/^(\+62|62|0)/)) {
    return 'Nomor telepon harus dimulai dengan +62, 62, atau 0';
  }

  // Minimum length check (after country code)
  const digitsOnly = cleanPhone.replace(/\D/g, '');
  if (digitsOnly.length < 10 || digitsOnly.length > 13) {
    return 'Panjang nomor telepon tidak valid (10-13 digit)';
  }

  return null;
};

export const validateBirthDate = (birthDate) => {
  if (!birthDate) return 'Tanggal lahir wajib diisi';

  const birth = new Date(birthDate);
  const today = new Date();
  const age = today.getFullYear() - birth.getFullYear();

  if (birth > today) {
    return 'Tanggal lahir tidak boleh di masa depan';
  }

  if (age < 0 || age > 150) {
    return 'Tanggal lahir tidak valid';
  }

  return null;
};

export const validatePatientForm = (formData) => {
  const errors = {};

  // Required field validations
  errors.name = validateRequired(formData.name, 'Nama lengkap');
  errors.nik = validateNIK(formData.nik);
  errors.phone = validatePhone(formData.phone);
  errors.birthDate = validateBirthDate(formData.birthDate);
  errors.gender = validateRequired(formData.gender, 'Jenis kelamin');
  errors.address = validateRequired(formData.address, 'Alamat');

  // Optional field validations
  errors.email = validateEmail(formData.email);

  // Remove null errors
  Object.keys(errors).forEach(key => {
    if (errors[key] === null) {
      delete errors[key];
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const formatPhoneNumber = (phone) => {
  if (!phone) return '';

  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');

  // Format Indonesian phone number
  if (digits.startsWith('62')) {
    // Already has country code
    return `+${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 9)} ${digits.slice(9)}`;
  } else if (digits.startsWith('0')) {
    // Local format, convert to international
    return `+62 ${digits.slice(1, 4)} ${digits.slice(4, 8)} ${digits.slice(8)}`;
  }

  return phone;
};

export const formatNIK = (nik) => {
  if (!nik) return '';

  // Remove all non-digit characters
  const digits = nik.replace(/\D/g, '');

  // Format NIK with spaces for readability
  if (digits.length === 16) {
    return `${digits.slice(0, 4)} ${digits.slice(4, 8)} ${digits.slice(8, 12)} ${digits.slice(12)}`;
  }

  return digits;
};

export const validateKaderForm = (formData) => {
  const errors = {};

  // Required field validations
  errors.name = validateRequired(formData.name, 'Nama lengkap');
  errors.kaderSince = validateRequired(formData.kaderSince, 'Tahun menjadi kader');
  errors.nik = validateNIK(formData.nik);
  errors.phone = validatePhone(formData.phone);
  errors.birthDate = validateBirthDate(formData.birthDate);
  errors.gender = validateRequired(formData.gender, 'Jenis kelamin');
  errors.education = validateRequired(formData.education, 'Pendidikan terakhir');
  errors.healthInsurance = validateRequired(formData.healthInsurance, 'Kepemilikan JKN');
  errors.bankAccount = validateRequired(formData.bankAccount, 'Nomor rekening');
  errors.posyanduArea = validateRequired(formData.posyanduArea, 'Posyandu wilayah');
  errors.posyanduName = validateRequired(formData.posyanduName, 'Nama posyandu');
  errors.ktpAddress = validateRequired(formData.ktpAddress, 'Alamat sesuai KTP');
  errors.residenceAddress = validateRequired(formData.residenceAddress, 'Alamat domisili');

  // Optional field validations
  errors.email = validateEmail(formData.email);

  // Remove null errors
  Object.keys(errors).forEach(key => {
    if (errors[key] === null) {
      delete errors[key];
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};