<!doctype html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="/assets/dist/style.min.css">
    <title><?= $title ?? 'Blog Application' ?></title>
</head>
<body <?= isset($bodyClass) ? "class='$bodyClass'" : '' ?>>
<header class="site-header">
    <div class="brand-wrap">
        <a class="brand" href="<?= $router->generatePath('post-index') ?>">Blog Application</a>
        <p class="subtitle">Lista postow i formularz edycji.</p>
    </div>
    <nav><?php require __DIR__ . DIRECTORY_SEPARATOR . 'nav.html.php'; ?></nav>
</header>
<main><?= $main ?? null ?></main>
<footer>
    <div class="footer-copy">
        <strong>Rossa Jakub</strong>
        <span>Album 57754</span>
    </div>
    <div class="footer-copy">&copy; <?= date('Y') ?> Blog Application</div>
</footer>
</body>
</html>
