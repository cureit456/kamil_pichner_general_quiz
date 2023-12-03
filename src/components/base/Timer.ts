

export class Timer extends HTMLElement {

    public static readonly TAG_NAME = 'quiz-timer';

    private _minutes: number = 0;
    private _seconds :number = 0;

    public get minutes(): number {
        return this._minutes;
    }
    public get seconds(): number {
        return this.seconds;
    }

    connectedCallback() {

        this.render();
      }
    
      private render():void {

        this.innerHTML = `
            <div class='time'></div>
        `
        const countdownElement = this.querySelector('.time') as HTMLElement;

        let count = 5 * 60; 
        
        const countdown = setInterval(() => {
            this._minutes = Math.floor(count / 60);
            this._seconds = count % 60;
        
        
            countdownElement.textContent = `${this._minutes < 10 ? '0' + this._minutes : this._minutes}:${ this._seconds < 10 ? '0' +  this._seconds :  this._seconds}`;
        
            count--;
            if(count < 0) {
                clearInterval(countdown);

                this.dispatchEvent(new CustomEvent('timeend'));

            }
        }, 1000);
      }


}
