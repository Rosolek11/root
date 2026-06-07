<?php

/** @var \App\Model\Post $post */
/** @var \App\Service\Router $router */

$title = "Edytuj post";
$bodyClass = "edit";

ob_start(); ?>
    <a class="button button-light back-link" href="<?= $router->generatePath('post-index') ?>">Powrot do listy</a>
    <section class="form-card">
        <div class="detail-meta">
            <span class="post-id">Post #<?= $post->getId() ?></span>
            <h1><?= $title ?></h1>
        </div>
        <form action="<?= $router->generatePath('post-edit') ?>" method="post" class="edit-form">
            <?php require __DIR__ . DIRECTORY_SEPARATOR . '_form.html.php'; ?>
            <input type="hidden" name="action" value="post-edit">
            <input type="hidden" name="id" value="<?= $post->getId() ?>">
        </form>
    </section>

    <ul class="action-list">
        <li>
            <form action="<?= $router->generatePath('post-delete') ?>" method="post">
                <input type="submit" class="button button-danger" value="Usun post" onclick="return confirm('Na pewno usunac ten post?')">
                <input type="hidden" name="action" value="post-delete">
                <input type="hidden" name="id" value="<?= $post->getId() ?>">
            </form>
        </li>
    </ul>

<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
