<?php

/*
 * Only the rules the project brief uses are translated. Any other rule falls
 * back to the English message from the framework.
 */
return [
    'accepted' => ':attribute kabul edilmelidir.',
    'array' => ':attribute bir liste olmalıdır.',
    'distinct' => ':attribute alanında yinelenen bir değer var.',
    'email' => ':attribute geçerli bir e-posta adresi olmalıdır.',
    'extensions' => ':attribute şu uzantılardan birine sahip olmalıdır: :values.',
    'file' => ':attribute bir dosya olmalıdır.',
    'in' => 'Seçilen :attribute geçersiz.',
    'max' => [
        'array' => ':attribute en fazla :max öğe içerebilir.',
        'file' => ':attribute en fazla :max kilobayt olabilir.',
        'string' => ':attribute en fazla :max karakter olabilir.',
    ],
    'mimes' => ':attribute şu türlerde bir dosya olmalıdır: :values.',
    'mimetypes' => ':attribute şu türlerde bir dosya olmalıdır: :values.',
    'min' => [
        'array' => ':attribute en az :min öğe içermelidir.',
        'file' => ':attribute en az :min kilobayt olmalıdır.',
        'string' => ':attribute en az :min karakter olmalıdır.',
    ],
    'regex' => ':attribute biçimi geçersiz.',
    'required' => ':attribute alanı zorunludur.',
    'required_if' => ':other :value olduğunda :attribute alanı zorunludur.',
    'string' => ':attribute metin olmalıdır.',
    'uploaded' => ':attribute yüklenemedi.',
    'url' => ':attribute geçerli bir web adresi olmalıdır.',
];
