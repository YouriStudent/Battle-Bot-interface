<?php 
    include_once('../functions/function.php');
?>

<div>
    <?php 
        if(!isset($_GET['eventId'])) {
            showEvents($admin = true); 
        }
    ?>
</div>  

<?php 
if(isset($_GET['eventId'])) { 
?>

<div class="row" id="eventPoints">
    <div class="col-4">  
        <form action="" method="post" id="points-form">
        <?php foreach($teams as $teamId => $team) { ?>
            <div class="form-group row mt-2">
                <div class="col-4 d-flex align-items-center">
                    <span><?= $team ?></span>
                </div>
                <div class="col-8 d-flex justify-content-around">
                    <input type="radio" class="btn-check" onclick="this.form.submit()" name="<?= $teamId ?>" id="<?=$team?>" value="25" autocomplete="off">
                    <label class="btn btn-secondary" for="<?=$team?>">25</label>

                    <input type="radio" class="btn-check" onclick="this.form.submit()" name="<?= $teamId ?>" id="<?=$team . '1'?>" value="18" autocomplete="off">
                    <label class="btn btn-secondary" for="<?=$team . '1'?>">18</label>

                    <input type="radio" class="btn-check" onclick="this.form.submit()" name="<?= $teamId ?>" id="<?=$team . '2'?>" value="15" autocomplete="off">
                    <label class="btn btn-secondary" for="<?=$team . '2'?>">15</label>

                    <input type="radio" class="btn-check" onclick="this.form.submit()" name="<?= $teamId ?>" id="<?=$team . '3'?>" value="12" autocomplete="off">
                    <label class="btn btn-secondary" for="<?=$team . '3'?>">12</label>

                    <input type="radio" class="btn-check" onclick="this.form.submit()" name="<?= $teamId ?>" id="<?=$team . '4'?>" value="10" autocomplete="off">
                    <label class="btn btn-secondary" for="<?=$team . '4'?>">10</label>     

                    <input type="submit" class="btn-check" onclick="this.form.submit()" name="revert" id="<?=$team . '5'?>" value="1" autocomplete="off">
                    <label class="btn btn-secondary" for="<?=$team . '5'?>">Revert  </label>
                </div>
            </div>
        <?php } ?>
        </form>
    </div>
    <div class="col-8 d-flex align-content-around">
        <div class="row mt-2">
            <?php foreach($teamPoints as $teamId => $points) { ?>
                <div class="col-12 d-block d-flex text-left align-items-center">
                    <span>Points: <?= $points ?></span>
                </div>
            <?php } ?>
        </div>
    </div>
</div>

<?php    
}
?>