<?php
/** @var $router \App\Service\Router */

?>
<ul>
    <li><a href="<?= $router->generatePath('post-index') ?>">Lista postow</a></li>
    <li><a href="<?= $router->generatePath('post-create') ?>">Nowy post</a></li>
</ul>
<?php
