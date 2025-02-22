<div class="eventBox">
    <form action="<?= htmlentities($_SERVER['PHP_SELF']) . '?' . http_build_query($_GET); ?>" method="post">
        <div class="form-group">
            <input class="form-control mt-3" min="<?php echo $today ?>" type="datetime-local" name="date" value="<?php if (isset($_POST['event'])) {echo htmlentities($_POST['date']);} ?>">
            <input class="form-control mt-3" type="text" name="eventNaam"  placeholder="Evenement naam" value="<?php if (isset($_POST['event'])) {echo htmlentities($_POST['eventNaam']);} ?>">
            <textarea class="form-control mt-3" name="eventOmschrijving" placeholder="Evenement omschrijving"><?php if (isset($_POST['event'])) {echo htmlentities($_POST['eventOmschrijving']);} ?></textarea>
            <div class="form-check mt-3">
                <input class="form-check-input" type="radio" value="private" name="eventType" id="eventType1">
                <label class="form-check-label" for="eventType1">
                    Privé evenement
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="radio" value="public" name="eventType" id="eventType2" checked>
                <label class="form-check-label" for="eventType2">
                    Openbaar evenement
                </label>
            </div>
            <input class="btn btn-danger mt-3" type="submit" name="event" value="Evenement toevoegen">
        </div>
    </form>
</div>