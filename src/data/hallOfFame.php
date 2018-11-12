$params = $_POST['params'];

$jsonObject = json_encode($params);
file_put_contents('HighScores.json', $jsonObject);