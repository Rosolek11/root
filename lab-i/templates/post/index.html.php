<?php

/** @var \App\Model\Post[] $posts */
/** @var \App\Service\Router $router */

$title = 'Lista postow';
$bodyClass = 'index';

ob_start(); ?>
    <section class="hero">
        <div>
            <h1>Lista postow</h1>
            <p class="lead">Przegladaj wpisy i przechodz do szczegolow lub edycji.</p>
        </div>
        <a class="button button-primary" href="<?= $router->generatePath('post-create') ?>">Nowy post</a>
    </section>

    <?php if ($posts): ?>
        <div class="post-grid">
            <?php foreach ($posts as $post): ?>
                <article class="post-card">
                    <div class="post-card-top">
                        <span class="post-id">ID <?= $post->getId() ?></span>
                        <h2><?= htmlspecialchars($post->getSubject() ?? 'Bez tytulu') ?></h2>
                    </div>
                    <p><?= htmlspecialchars(mb_strimwidth((string) $post->getContent(), 0, 140, '...')) ?></p>
                    <ul class="action-list">
                        <li><a class="button button-light" href="<?= $router->generatePath('post-show', ['id' => $post->getId()]) ?>">Szczegoly</a></li>
                        <li><a class="button button-accent" href="<?= $router->generatePath('post-edit', ['id' => $post->getId()]) ?>">Edytuj</a></li>
                    </ul>
                </article>
            <?php endforeach; ?>
        </div>
    <?php else: ?>
        <section class="empty-state">
            <h2>Brak postow</h2>
            <p>Dodaj pierwszy wpis.</p>
            <a class="button button-primary" href="<?= $router->generatePath('post-create') ?>">Utworz post</a>
        </section>
    <?php endif; ?>

<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
