<?php
$teams = getAllTeams();
$events = getAllEvents();
?>

<div class="eventRobotBox">
    <form action="<?= htmlentities($_SERVER['PHP_SELF']); ?>" method="POST">
        <div class="form-group">
            <?php
            if (!isset($_SESSION['selectedTeam'])) {
            ?>
                <div>
                    <span>Selecteer een team</span>
                    <select onchange="this.form.submit()" class="form-select" aria-label="Default select example" name="selectedTeam">
                        <option value="" disabled selected>Kies een team</option>
                        <?php
                        foreach ($teams as $team) {
                            echo '<option value="'. $team['id'] .'">' . $team['name'] . '</option>';
                        }
                        ?>
                    </select>
                </div>
                <i>Bij het selecteren van een keuze wordt er een nieuw menu getoond.</i>
                <!-- <input class="btn btn-danger mt-3" type="submit" name="selectRobot" value="Selecteer robot"> -->
            <?php
            }
            ?>

            <?php
            if (isset($_SESSION['selectedTeam'])) {
            ?>
                <div>
                    <span>Selecteer een event</span>
                    <select onchange="this.form.submit()" class="form-select" aria-label="Default select example" name="selectedEvent">
                        <option value="" disabled selected>Kies een event</option>
                        <?php
                        foreach ($events as $event) {
                            echo '<option value="'. $event['id'] .'">' . $event['name'] . '</option>';
                        }
                        ?>
                    </select>
                </div>
                <i>Bij het selecteren van een keuze wordt er een nieuw menu getoond.</i>
                <!-- <input class="btn btn-danger mt-3" type="submit" name="robotToEvent" value="Robot aan event toevoegen"> -->
            <?php
            }
            ?>

            
        </div>
    </form>
</div>