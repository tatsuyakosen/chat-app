<!DOCTYPE html>
<html>
<head>
    <title>お問い合わせ内容</title>
</head>
<body>
    <h2>新しいお問い合わせがあります</h2>
    <p><strong>名前:</strong> {{ $details['name'] }}</p>
    <p><strong>メールアドレス:</strong> {{ $details['email'] }}</p>
    <p><strong>メッセージ:</strong></p>
    <p>{{ $details['message'] }}</p>
</body>
</html>
