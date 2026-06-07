<?php
    /** @var $post ?\App\Model\Post */
?>

<div class="form-group">
    <label for="subject">Tytul</label>
    <input type="text" id="subject" name="post[subject]" value="<?= htmlspecialchars($post ? (string) $post->getSubject() : '') ?>" required>
</div>

<div class="form-group">
    <label for="content">Tresc</label>
    <textarea id="content" name="post[content]" rows="10"><?= htmlspecialchars($post ? (string) $post->getContent() : '') ?></textarea>
</div>

<div class="form-group">
    <label></label>
    <input type="submit" class="button button-primary" value="Zapisz">
</div>
