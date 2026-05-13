<?php
$data = ["name" => "Jakub Rossa", "index" => "57754", "date" => date(DATE_ATOM)]; $yaml = yaml_emit($data); echo $yaml;