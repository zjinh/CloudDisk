<template>
    <div class="SlimfWindowContainer">
        <div class="CloudDiskInfoControl">
            <p>12341</p>
            <button class="sf-icon-times" @click=""></button>
            <button class="sf-icon-window-minimize" @click="" style="font-size: 12px"></button>
        </div>
        <div class="SlimfVideoContainer">
            <video crossorigin="*" src="http://cloud.com:100/upload/1E37CCEE-3AFE-D890-53F6-738E1BA37DA7/user_disk/907A59D5-19B2-E3F2-53BB-5A510F0A4D55.mp4">
            </video>
            <div class="SlimfVideoControl"
            ><div class="SlimfVideoPlay sf-icon-play"></div>
                <div class="SlimfVideoSlider">
                    <div class="SlimfVideoSliderBar">
                        <span></span>
                    </div>
                    <div class="SlimfVideoTempBar" style="width: 1%;"></div>
                </div>
                <div class="SlimfVideoTime">00:00/00:00</div>
                <div class="sf-icon-volume-up"></div>
                <div class="sf-icon-expand"></div>
            </div>
                <div class="SlimfVideoVolumn">
                <div class="SlimfVideoVolumnSlider">
                    <div class="SlimfVideoVolumnSliderBar">
                        <span></span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "DiskVideoPlayer"
    }
</script>

<style scoped>
    @import url("../../../static/css/Slimf.css");
    @import url("../../../static/css/disk.css");
</style>