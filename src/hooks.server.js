/**
 * Modified from: https://github.com/jianyuan/pocketbase-sveltekit-auth/
 */
import PocketBase from 'pocketbase';

//  Type and variables
import { PUBLIC_DATABASE_URL } from '$env/static/public';

export const handle = async ({ event, resolve }) => {
	event.locals.pocketbase = new PocketBase(PUBLIC_DATABASE_URL);
	event.locals.pocketbase.authStore.loadFromCookie(event.request.headers.get('cookie') || '');
	// Log detailed request information including IP address, user agent, location, device type, operating system, language, and referrer
	const ip = event.request.headers.get('cf-connecting-ip') || event.request.headers.get('x-forwarded-for') || event.request.headers.get('x-real-ip') || event.clientAddress;
	const userAgent = event.request.headers.get('user-agent');
	const countryCode = event.request.headers.get('cf-ipcountry');
	const countryNameMap = {
		'AF': 'Afghanistan',
		'AL': 'Albania',
		'DZ': 'Algeria',
		'AS': 'American Samoa',
		'AD': 'Andorra',
		'AO': 'Angola',
		'AI': 'Anguilla',
		'AQ': 'Antarctica',
		'AG': 'Antigua and Barbuda',
		'AR': 'Argentina',
		'AM': 'Armenia',
		'AW': 'Aruba',
		'AU': 'Australia',
		'AT': 'Austria',
		'AZ': 'Azerbaijan',
		'BS': 'Bahamas',
		'BH': 'Bahrain',
		'BD': 'Bangladesh',
		'BB': 'Barbados',
		'BY': 'Belarus',
		'BE': 'Belgium',
		'BZ': 'Belize',
		'BJ': 'Benin',
		'BM': 'Bermuda',
		'BT': 'Bhutan',
		'BO': 'Bolivia',
		'BA': 'Bosnia and Herzegovina',
		'BW': 'Botswana',
		'BR': 'Brazil',
		'BN': 'Brunei',
		'BG': 'Bulgaria',
		'BF': 'Burkina Faso',
		'BI': 'Burundi',
		'KH': 'Cambodia',
		'CM': 'Cameroon',
		'CA': 'Canada',
		'CV': 'Cape Verde',
		'KY': 'Cayman Islands',
		'CF': 'Central African Republic',
		'TD': 'Chad',
		'CL': 'Chile',
		'CN': 'China',
		'CO': 'Colombia',
		'KM': 'Comoros',
		'CG': 'Congo - Brazzaville',
		'CD': 'Congo - Kinshasa',
		'CR': 'Costa Rica',
		'CI': 'Côte d’Ivoire',
		'HR': 'Croatia',
		'CU': 'Cuba',
		'CY': 'Cyprus',
		'CZ': 'Czechia',
		'DK': 'Denmark',
		'DJ': 'Djibouti',
		'DM': 'Dominica',
		'DO': 'Dominican Republic',
		'EC': 'Ecuador',
		'EG': 'Egypt',
		'SV': 'El Salvador',
		'GQ': 'Equatorial Guinea',
		'ER': 'Eritrea',
		'EE': 'Estonia',
		'SZ': 'Eswatini',
		'ET': 'Ethiopia',
		'FJ': 'Fiji',
		'FI': 'Finland',
		'FR': 'France',
		'GA': 'Gabon',
		'GM': 'Gambia',
		'GE': 'Georgia',
		'DE': 'Germany',
		'GH': 'Ghana',
		'GR': 'Greece',
		'GD': 'Grenada',
		'GU': 'Guam',
		'GT': 'Guatemala',
		'GN': 'Guinea',
		'GW': 'Guinea-Bissau',
		'GY': 'Guyana',
		'HT': 'Haiti',
		'HN': 'Honduras',
		'HK': 'Hong Kong SAR China',
		'HU': 'Hungary',
		'IS': 'Iceland',
		'IN': 'India',
		'ID': 'Indonesia',
		'IR': 'Iran',
		'IQ': 'Iraq',
		'IE': 'Ireland',
		'IL': 'Israel',
		'IT': 'Italy',
		'JM': 'Jamaica',
		'JP': 'Japan',
		'JO': 'Jordan',
		'KZ': 'Kazakhstan',
		'KE': 'Kenya',
		'KI': 'Kiribati',
		'KW': 'Kuwait',
		'KG': 'Kyrgyzstan',
		'LA': 'Laos',
		'LV': 'Latvia',
		'LB': 'Lebanon',
		'LS': 'Lesotho',
		'LR': 'Liberia',
		'LY': 'Libya',
		'LI': 'Liechtenstein',
		'LT': 'Lithuania',
		'LU': 'Luxembourg',
		'MO': 'Macao SAR China',
		'MG': 'Madagascar',
		'MW': 'Malawi',
		'MY': 'Malaysia',
		'MV': 'Maldives',
		'ML': 'Mali',
		'MT': 'Malta',
		'MH': 'Marshall Islands',
		'MR': 'Mauritania',
		'MU': 'Mauritius',
		'MX': 'Mexico',
		'FM': 'Micronesia',
		'MD': 'Moldova',
		'MC': 'Monaco',
		'MN': 'Mongolia',
		'ME': 'Montenegro',
		'MA': 'Morocco',
		'MZ': 'Mozambique',
		'MM': 'Myanmar (Burma)',
		'NA': 'Namibia',
		'NR': 'Nauru',
		'NP': 'Nepal',
		'NL': 'Netherlands',
		'NC': 'New Caledonia',
		'NZ': 'New Zealand',
		'NI': 'Nicaragua',
		'NE': 'Niger',
		'NG': 'Nigeria',
		'KP': 'North Korea',
		'MK': 'North Macedonia',
		'NO': 'Norway',
		'OM': 'Oman',
		'PK': 'Pakistan',
		'PW': 'Palau',
		'PS': 'Palestinian Territories',
		'PA': 'Panama',
		'PG': 'Papua New Guinea',
		'PY': 'Paraguay',
		'PE': 'Peru',
		'PH': 'Philippines',
		'PL': 'Poland',
		'PT': 'Portugal',
		'PR': 'Puerto Rico',
		'QA': 'Qatar',
		'RO': 'Romania',
		'RU': 'Russia',
		'RW': 'Rwanda',
		'WS': 'Samoa',
		'SM': 'San Marino',
		'ST': 'São Tomé and Príncipe',
		'SA': 'Saudi Arabia',
		'SN': 'Senegal',
		'RS': 'Serbia',
		'SC': 'Seychelles',
		'SL': 'Sierra Leone',
		'SG': 'Singapore',
		'SK': 'Slovakia',
		'SI': 'Slovenia',
		'SB': 'Solomon Islands',
		'SO': 'Somalia',
		'ZA': 'South Africa',
		'KR': 'South Korea',
		'SS': 'South Sudan',
		'ES': 'Spain',
		'LK': 'Sri Lanka',
		'SD': 'Sudan',
		'SR': 'Suriname',
		'SE': 'Sweden',
		'CH': 'Switzerland',
		'SY': 'Syria',
		'TW': 'Taiwan',
		'TJ': 'Tajikistan',
		'TZ': 'Tanzania',
		'TH': 'Thailand',
		'TL': 'Timor-Leste',
		'TG': 'Togo',
		'TK': 'Tokelau',
		'TO': 'Tonga',
		'TT': 'Trinidad and Tobago',
		'TN': 'Tunisia',
		'TR': 'Turkey',
		'TM': 'Turkmenistan',
		'TV': 'Tuvalu',
		'UG': 'Uganda',
		'UA': 'Ukraine',
		'AE': 'United Arab Emirates',
		'GB': 'United Kingdom',
		'US': 'United States',
		'UY': 'Uruguay',
		'UZ': 'Uzbekistan',
		'VU': 'Vanuatu',
		'VA': 'Vatican City',
		'VE': 'Venezuela',
		'VN': 'Vietnam',
		'WF': 'Wallis and Futuna',
		'EH': 'Western Sahara',
		'YE': 'Yemen',
		'ZM': 'Zambia',
		'ZW': 'Zimbabwe'
	};
	const countryName = countryNameMap[countryCode] || 'Unknown';
	const device = /mobile/i.test(userAgent) ? 'Mobile' : 'Desktop';
	const operatingSystem = /windows/i.test(userAgent) ? 'Windows' :
	                        /macintosh/i.test(userAgent) ? 'MacOS' :
	                        /linux/i.test(userAgent) ? 'Linux' :
	                        /android/i.test(userAgent) ? 'Android' :
	                        /iphone|ipad/i.test(userAgent) ? 'iOS' : 'Unknown';
	const language = event.request.headers.get('accept-language');
	const referrer = event.request.headers.get('referer') || event.request.headers.get('referrer');
	const contentType = event.request.headers.get('content-type');
	const contentLength = event.request.headers.get('content-length');
	const acceptEncoding = event.request.headers.get('accept-encoding');
	const connection = event.request.headers.get('connection');
	const host = event.request.headers.get('host');

	console.log('Request IP:', ip);
	console.log('User Agent:', userAgent);
	console.log('Country:', countryName);
	console.log('Device:', device);
	console.log('Operating System:', operatingSystem);
	console.log('Language:', language);
	console.log('Referrer:', referrer);
	console.log('Host:', host);
	console.log('----------------------------------------');

	// Save log information to PocketBase
	try {
		await event.locals.pocketbase.collection('log').create({
			ip,
			userAgent,
			country: countryName,
			device,
			operatingSystem,
			language,
			referrer,
			host,
		});
	} catch (err) {
		console.error('Error saving log information:', err);
	}

	try {
		if (event.locals.pocketbase.authStore.isValid) {
			await event.locals.pocketbase.collection('users').authRefresh();
		}
		event.locals.user = structuredClone(event.locals.pocketbase.authStore.model);
	} catch (__error) {
		event.locals.pocketbase.authStore.clear();
		event.locals.user = null;
	}

	const response = await resolve(event);
	const expires = new Date();

	// Set expiration time on the cookie
	expires.setTime(expires.getTime() + 1000 * 60 * 60 * 24 * 7);

	response.headers.append(
		'set-cookie',
		event.locals.pocketbase.authStore.exportToCookie({ secure: true, expires, sameSite: 'none' })
	);

	return response;
};
