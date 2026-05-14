<?php

/** @var \App\Model\Post $post */
/** @var \App\Model\Comment[] $comments */
/** @var \App\Service\Router $router */

$title = "{$post->getSubject()} ({$post->getId()})";
$bodyClass = 'show';

ob_start(); ?>
    <h1><?= $post->getSubject() ?></h1>
    <article>
        <?= $post->getContent();?>
    </article>

    <ul class="action-list">
        <li> <a href="<?= $router->generatePath('post-index') ?>">Back to list</a></li>
        <li><a href="<?= $router->generatePath('post-edit', ['id'=> $post->getId()]) ?>">Edit</a></li>
    </ul>

    <section class="comments">
        <h2>Comments</h2>

        <?php foreach ($comments as $comment): ?>
            <div class="comment">
                <strong><?= htmlspecialchars($comment->getAuthor()) ?></strong>
                <p><?= htmlspecialchars($comment->getContent()) ?></p>
                <ul class="action-list">
                    <li><a href="<?= $router->generatePath('comment-edit', ['id' => $comment->getId()]) ?>">Edit</a></li>
                    <li><a href="<?= $router->generatePath('comment-delete', ['id' => $comment->getId()]) ?>">Delete</a></li>
                </ul>
            </div>
        <?php endforeach; ?>

        <h3>Add comment</h3>
        <form action="<?= $router->generatePath('comment-create') ?>" method="post" class="edit-form">
            <input type="hidden" name="action" value="comment-create">
            <input type="hidden" name="comment[post_id]" value="<?= $post->getId() ?>">
            <div class="form-group">
                <label for="author">Author</label>
                <input type="text" id="author" name="comment[author]" value="">
            </div>
            <div class="form-group">
                <label for="content">Content</label>
                <textarea id="content" name="comment[content]"></textarea>
            </div>
            <div class="form-group">
                <label></label>
                <input type="submit" value="Submit">
            </div>
        </form>
    </section>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
