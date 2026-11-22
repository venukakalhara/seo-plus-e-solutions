import { getCountries, parsePhoneNumberFromString, type CountryCode } from 'libphonenumber-js/max';

export function normalizeMobile(value: unknown, country: unknown): string {
 if(value===undefined||value===null||value==='')throw new Error('Mobile number is required.');
 if(typeof value!=='string'||value.length>40||!/^\+?[\d\s().-]+$/.test(value.trim()))throw new Error('Enter a valid mobile number using digits only.');
 if(typeof country!=='string'||!getCountries().includes(country as CountryCode))throw new Error('Select a valid country.');
 const parsed=parsePhoneNumberFromString(value.trim(),{defaultCountry:country as CountryCode,extract:false});
 if(!parsed?.isValid()||parsed.country!==country||!['MOBILE','FIXED_LINE_OR_MOBILE'].includes(parsed.getType()||''))throw new Error('Enter a valid mobile number for the selected country.');
 return parsed.number;
}
