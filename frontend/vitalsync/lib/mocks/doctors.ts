import { Doctor } from '@/types/doctor';

export const mockDoctors: Doctor[] = [
  {
    id: 'elena-vargas',
    name: 'Dr. Elena Vargas',
    specialty: 'Cardiología',
    cmp: 'CMP 654321',
    rating: 4.6,
    ratingCount: 123,
    location: 'Lima, Miraflores',
    insurances: ['SIS', 'Privado'],
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDFjnYWesLs9aQMZUfsS-ZxKFpLpRZB_Ckc68Fs_SSEIF3ip6kmKVsH7T37uc4HYQr47U3q_XcVndR_A2ZTv0dpqABIK1VqUwFHUZ1QledpkJ7-OLdlT4_SMo95gofxwY7DbU9eZ17HbgLbp9gIsKjFjmXXhakgdZwDcaEcIU6d64OWNCHJlUV8iMtZ6M_oWp99N3Xu-SM5XWPR5t91HVeHLHHtEN4P3U8UJWNCTHwPKqPgNq402KLkW5SESynketq3OeLzDdPBK0k',
  },
  {
    id: 'carlos-mendoza',
    name: 'Dr. Carlos Mendoza',
    specialty: 'Dermatología',
    cmp: 'CMP 123456',
    rating: 4.9,
    ratingCount: 98,
    location: 'Lima, San Isidro',
    insurances: ['EsSalud', 'Privado'],
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCdetg1qC21tjmjIBgoak1tesU6mCE7CEG2AgUConQGrm3QXkxntdOKrlrZz_oTdw7QPD5kPvuE4zqWAuF6XbprxoK1zhDq8d_PLRJQohp8-XRl1KVfhqo9_vRr6yzgaw4Y9A8QUy8Qf3R3gL1UCLS_HV-Ozav7OaMduzdjCsASP_lESzWsrKYbGwfcY5eMVgI14OO4sxaTZcoRtPhfSLE-yODaoCBU0s-UEM9uGHDwt6wcnJ1OXr-Tfo8B9EUhxRsusDdywCpDtec',
  },
  {
    id: 'sofia-quispe',
    name: 'Dra. Sofia Quispe',
    specialty: 'Pediatría',
    cmp: 'CMP 789012',
    rating: 4.4,
    ratingCount: 150,
    location: 'Arequipa',
    insurances: ['SIS'],
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD4uq_VfR8XZGB0jDLwS3Md-PE1hDmwcwDVpZqtaCRiFaWN1erOz4jY2sAkHzJpRUVmKmmjPySOcwQUJAdI74VjzbbcqJ3F4Hva50AtHTKwlwztwBdd4CTDq5uEtVduQOTndu0nUwVfpsPSCtpfHu9MAfYU-1E_Ddbz9LoH980eaoEktuXQB7dUz6Rm1Wv0L0fcobUCY6ftWivABbod0_8ZLLxw8Jzjf8-vpMA_PEaE6jPe63VUvFooR4mtvU65MRQvd-kF3--lmDg',
  },
  {
    id: 'javier-torres',
    name: 'Dr. Javier Torres',
    specialty: 'Ginecología',
    cmp: 'CMP 456789',
    rating: 5,
    ratingCount: 85,
    location: 'Cusco',
    insurances: ['Privado'],
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCYlD_xP19GwVlqfu_jlEaatpYfTTtb50SSL1WANatuAqi9k2dWB2xfl6n2B986GVPRE4f-5nyr3XxX_sqsO72YCqrIlhRBiuAHtlcJpE10icbl5uhxvtGcyRA2v6qKpFqHxu-sBTjLQY0V3Iqr8WsHDdd-NK2WurogU6w3hcfwaPQDfc-uXh1FL1gCTca0JEN249oRwVO5RkxPS9IFfB_6keoxlXg1SXVBYGwRbUj0M76eSTbQu8ZfgECmUZHl87RsQ9MEnNgAicE',
  },
  {
    id: 'ana-flores',
    name: 'Dra. Ana Flores',
    specialty: 'Cardiología',
    cmp: 'CMP 234567',
    rating: 4.3,
    ratingCount: 110,
    location: 'Lima, Miraflores',
    insurances: ['EsSalud'],
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD7Z84FTTTzCejfGTNPxfkbyDN2hkLoYO-owxTJ4jl5jL8J4TUjud0xX597IgjQbyXTHTjZj93VtoabfxP3x0j2N5nX2MkEXB6QSgnLV8wkiKiz3YWsZYW4fIOyCaQzc65d6HiEQOyD5K-NMIjXiH8WA94CsWpeuwaFs4lz2Z7jx8M3HSIUcEeI0_KYTPXn4ba6wR0hEhN3cRz1M7NnO5Bg_AewGvH87EX5FP0hha3hUuNfd51wHzhj5QoZ5GXNLgxHqwXO4rfEIGs',
  },
  {
    id: 'luis-garcia',
    name: 'Dr. Luis Garcia',
    specialty: 'Dermatología',
    cmp: 'CMP 345678',
    rating: 4.2,
    ratingCount: 72,
    location: 'Lima, San Isidro',
    insurances: ['SIS', 'Privado'],
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB06UR65T7-UG6wqMVCMHY6jxs1ZgIhWkGlkBVjIKW4YmwuesDqVzwNR6geil7OAYXLgC2oXDT-nug83tvCBBuEMkF0BYTxDz494u-YOVctD5EyKalNo1CoHnJxC_ND1vfTaauU6fIQMttGZWbuuLMr9U1f5M9LCgJCjcNkK2EiPlmYTugozcbGNJkAe85OTYo_pBGGa4iayALkfGxhqH6RKPP_WY00FRMcNIPZPLyVCrRqPrR8hnbMhIjY5oVkaq9RP8YphbXV1V0',
  },
];
