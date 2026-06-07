<?php

/** @var \App\Model\Post $post */
/** @var \App\Service\Router $router */

$title = 'Nowy post';
$bodyClass = "edit";

ob_start(); ?>
    <a class="button button-light back-link" href="<?= $router->generatePath('post-index') ?>">Powrot do listy</a>
    <section class="form-card">
        <div class="detail-meta">
            <span class="post-id">Nowy rekord</span>
            <h1><?= $title ?></h1>
        </div>
        <form action="<?= $router->generatePath('post-create') ?>" method="post" class="edit-form">
            <?php require __DIR__ . DIRECTORY_SEPARATOR . '_form.html.php'; ?>
            <input type="hidden" name="action" value="post-create">
        </form>
    </section>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
