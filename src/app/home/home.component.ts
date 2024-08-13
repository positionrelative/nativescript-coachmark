import { AfterViewInit, Component } from "@angular/core";
import { Page } from "@nativescript/core";
import { CoachMark, CoachMarks, ICoachMarkOptions } from "@nstudio/nativescript-coachmarks";
import { View } from '@nativescript/core';
import { timer } from "rxjs";
import { AppTour, TourEvents, TourStop } from "nativescript-app-tour";

@Component({
  selector: "Home",
  templateUrl: "./home.component.html",
})
export class HomeComponent implements AfterViewInit {

  constructor(private page: Page) {
  }

  ngAfterViewInit(): void {
    timer(1000).subscribe(() => {
      const nativeElementOne = this.page.getViewById<View>('one');
      const nativeElementTwo = this.page.getViewById<View>('two');
      const nativeElementThree = this.page.getViewById<View>('three');

      if (!nativeElementOne || !nativeElementTwo || !nativeElementThree) {
        console.error("One or more native elements are not defined");
        return;
      }

      
    const stops: TourStop[] = [
      {
          view: nativeElementOne,
          title: 'Feature 1',
          description: "Feature 1 Description",
          dismissable: false,
          innerCircleRadius: 30,
          outerCircleOpacity: 0.20
      },
      {
          view: nativeElementTwo,
          title: 'Feature 2',
          description: "Feature 2 Description",
          dismissable: false,
          innerCircleRadius: 30,
          outerCircleOpacity: 0.20
      },
      {
          view: nativeElementThree,
          title: 'Feature 3',
          description: 'Feature 3 Description',
          outerCircleColor: 'orange',
          rippleColor: 'black',
          innerCircleRadius: 30,
          outerCircleOpacity: 0.20
      }
  ];

  const handlers: TourEvents = {
      finish() {
          console.log('Tour finished');
      },
      onStep(lastStopIndex) {
          console.log('User stepped', lastStopIndex);
      },
      onCancel(lastStopIndex) {
          console.log('User cancelled', lastStopIndex);
      }
  }

    const tour = new AppTour(stops, handlers);
    tour.show();

        let marks = [];

        CoachMarks.DEBUG = false;
        const cm = new CoachMarks();
        cm.initEvents();
        cm.events.on('navigate', (eventData: any) => {
          console.log(`navigated to index in demo:`, eventData?.data.index);
        });
        cm.events.on('click', (eventData: any) => {
          console.log(`clicked at index in demo:`, eventData?.data.index);
        });
        cm.events.on('cleanup', () => {
          console.log(`ready to cleanup in demo.`);
        });

        marks.push(new CoachMark({
          caption: "This is the first element",
          view: nativeElementOne,
        }));

        marks.push(new CoachMark({
          caption: "This is the second element",
          view: nativeElementTwo,
        }));

        marks.push(new CoachMark({
          caption: "This is the third element",
          view: nativeElementThree,
        }));


        let options: ICoachMarkOptions = {
          enableContinueLabel: true,
          continueLabelText: 'Tap Screen for Next Tip',
          skipButtonText: 'Exit',
          lblSpacing: 20,
          maskColor: global.isIOS ? UIColor.colorWithRedGreenBlueAlpha(0.30, 0.46, 0.89, .9) : null
        };


        //CoachMarks.start(marks, options, cm);
    });
  }
}
