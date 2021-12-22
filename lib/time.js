//stackOverflow function that converst millis to minutes and seconds


export function millisToMinutesAndSeconds(millis){
    
    const minutes = Math.floor(millis/60000);

    const seconds = ((millis %60000) / 1000).toFixed(0);
    //if seconds == 60 makes it a minute and excess is seconds
    return seconds == 60
        ? minutes + 1 + ".00"
        :minutes + ":" + (seconds < 10 ? "0" : "") +
        seconds;
}