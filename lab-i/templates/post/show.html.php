<?php

/** @var \App\Model\Post $post */
/** @var \App\Service\Router $router */

$title = "Szczegoly posta";
$bodyClass = 'show';

ob_start(); ?>
    <a class="button button-light back-link" href="<?= $router->generatePath('post-index') ?>">Powrot do listy</a>
    <section class="detail-card">
        <div class="detail-meta">
            <span class="post-id">Post #<?= $post->getId() ?></span>
            <h1><?= htmlspecialchars($post->getSubject() ?? 'Bez tytulu') ?></h1>
        </div>
        <article class="detail-content">
            <?= nl2br(htmlspecialchars((string) $post->getContent())) ?>
        </article>
    </section>
    <ul class="action-list">
        <li><a class="button button-accent" href="<?= $router->generatePath('post-edit', ['id'=> $post->getId()]) ?>">Edytuj</a></li>
        <li>
            <form action="<?= $router->generatePath('post-delete') ?>" method="post">
                <input type="submit" class="button button-danger" value="Usun" onclick="return confirm('Na pewno usunac ten post?')">
                <input type="hidden" name="action" value="post-delete">
                <input type="hidden" name="id" value="<?= $post->getId() ?>">
            </form>
        </li>
    </ul>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
