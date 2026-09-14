export function getCityFromPincode(pincode: string): { city: string; state: string } {
  const pin = (pincode || '').replace(/\D/g, '');
  if (pin.length < 2) return { city: 'Mumbai', state: 'Maharashtra' };
  const prefix = pin.substring(0, 2);

  if (prefix === '11') return { city: 'New Delhi', state: 'Delhi' };
  if (prefix === '40') return { city: 'Mumbai', state: 'Maharashtra' };
  if (prefix === '41') return { city: 'Pune', state: 'Maharashtra' };
  if (prefix === '56') return { city: 'Bengaluru', state: 'Karnataka' };
  if (prefix === '50') return { city: 'Hyderabad', state: 'Telangana' };
  if (prefix === '60') return { city: 'Chennai', state: 'Tamil Nadu' };
  if (prefix === '70') return { city: 'Kolkata', state: 'West Bengal' };
  if (prefix === '38') return { city: 'Ahmedabad', state: 'Gujarat' };
  if (prefix === '30') return { city: 'Jaipur', state: 'Rajasthan' };
  if (prefix === '20') return { city: 'Noida / Ghaziabad', state: 'Uttar Pradesh' };
  if (prefix === '22') return { city: 'Lucknow', state: 'Uttar Pradesh' };
  if (prefix === '12') return { city: 'Gurugram', state: 'Haryana' };
  if (prefix === '14') return { city: 'Ludhiana', state: 'Punjab' };
  if (prefix === '46') return { city: 'Bhopal', state: 'Madhya Pradesh' };
  if (prefix === '45') return { city: 'Indore', state: 'Madhya Pradesh' };
  if (prefix === '80') return { city: 'Patna', state: 'Bihar' };
  if (prefix === '83') return { city: 'Ranchi', state: 'Jharkhand' };
  if (prefix === '75') return { city: 'Bhubaneswar', state: 'Odisha' };
  if (prefix === '78') return { city: 'Guwahati', state: 'Assam' };
  if (prefix === '68') return { city: 'Kochi', state: 'Kerala' };
  if (prefix === '69') return { city: 'Thiruvananthapuram', state: 'Kerala' };
  if (prefix === '39') return { city: 'Surat', state: 'Gujarat' };
  if (prefix === '34') return { city: 'Jodhpur', state: 'Rajasthan' };

  const num = parseInt(prefix, 10);
  if (num >= 12 && num <= 13) return { city: 'Haryana', state: 'Haryana' };
  if (num >= 14 && num <= 16) return { city: 'Punjab', state: 'Punjab' };
  if (num >= 20 && num <= 28) return { city: 'Uttar Pradesh', state: 'Uttar Pradesh' };
  if (num >= 30 && num <= 34) return { city: 'Rajasthan', state: 'Rajasthan' };
  if (num >= 36 && num <= 39) return { city: 'Gujarat', state: 'Gujarat' };
  if (num >= 40 && num <= 44) return { city: 'Maharashtra', state: 'Maharashtra' };
  if (num >= 45 && num <= 49) return { city: 'Madhya Pradesh', state: 'Madhya Pradesh' };
  if (num >= 50 && num <= 53) return { city: 'Telangana', state: 'Telangana' };
  if (num >= 56 && num <= 59) return { city: 'Karnataka', state: 'Karnataka' };
  if (num >= 60 && num <= 64) return { city: 'Tamil Nadu', state: 'Tamil Nadu' };
  if (num >= 67 && num <= 69) return { city: 'Kerala', state: 'Kerala' };
  if (num >= 70 && num <= 74) return { city: 'West Bengal', state: 'West Bengal' };
  if (num >= 75 && num <= 77) return { city: 'Odisha', state: 'Odisha' };
  if (num >= 78 && num <= 79) return { city: 'Assam', state: 'Assam' };
  if (num >= 80 && num <= 85) return { city: 'Bihar', state: 'Bihar' };

  return { city: 'India', state: 'India' };
}
