import { View, Application } from '@nativescript/core';
import { Injectable } from '@angular/core';

import { isAndroid, isIOS } from '@nativescript/core/platform';

@Injectable({
  providedIn: 'root',
})
export class CoachmarkService {
  constructor() {}

  showCoachMark(targetView: View, caption: string): void {
    if (isAndroid) {
      this.showAndroidCoachMark(targetView, caption);
    } else if (isIOS) {
      this.showIOSCoachMark(targetView, caption);
    }
  }
  
  private showAndroidCoachMark(targetView: View, caption: string): void {
    const context = targetView._context;
    const rootView = Application.android.foregroundActivity.getWindow().getDecorView().getRootView() as android.widget.FrameLayout;

    // Get target view location on the screen
    const location = Array.create('int', 2);
    targetView.android.getLocationOnScreen(location);
    const x = location[0];
    const y = location[1];

    // Create a circular highlight view around the target view
    const highlightView = new android.view.View(context);

    const highlightParams = new android.widget.FrameLayout.LayoutParams(
        targetView.getMeasuredWidth() + 100,
        targetView.getMeasuredHeight() + 100
    );
    highlightParams.leftMargin = x - 50;
    highlightParams.topMargin = y - 50;

    // Set background as a drawable with a circular shape and shadow
    const gradientDrawable = new android.graphics.drawable.GradientDrawable();
    gradientDrawable.setShape(android.graphics.drawable.GradientDrawable.OVAL);
    gradientDrawable.setColor(android.graphics.Color.argb(150, 255, 255, 255)); // White with some transparency
    gradientDrawable.setStroke(10, android.graphics.Color.argb(100, 0, 0, 0)); // Light gray border
    highlightView.setBackgroundDrawable(gradientDrawable);

    rootView.addView(highlightView, highlightParams);
    rootView.bringChildToFront(targetView.android);

    // Create and add the caption TextView (optional)
    const textView = new android.widget.TextView(context);
    textView.setText(caption);
    textView.setTextColor(android.graphics.Color.BLACK);
    textView.setBackgroundColor(android.graphics.Color.TRANSPARENT);

    const textParams = new android.widget.FrameLayout.LayoutParams(
        android.widget.FrameLayout.LayoutParams.WRAP_CONTENT,
        android.widget.FrameLayout.LayoutParams.WRAP_CONTENT
    );
    textParams.leftMargin = x + targetView.getMeasuredWidth() / 2 - 100; // Center text under the view
    textParams.topMargin = y + targetView.getMeasuredHeight() + 60;

    rootView.addView(textView, textParams);

    // Set up a click listener to remove the highlight
    highlightView.setOnClickListener(new android.view.View.OnClickListener({
        onClick: () => {
            rootView.removeView(highlightView);
            rootView.removeView(textView);
        },
    }));
  }










  

  

  private showIOSCoachMark(targetView: View, caption: string): void {
    const controller = targetView.ios.window.rootViewController;
    const overlay = UIView.alloc().initWithFrame(UIScreen.mainScreen.bounds);
    overlay.backgroundColor = UIColor.blackColor.colorWithAlphaComponent(0.7);
    controller.view.addSubview(overlay);

    const maskLayer = CAShapeLayer.layer();
    const path = UIBezierPath.bezierPathWithRect(overlay.bounds);
    const circlePath = UIBezierPath.bezierPathWithOvalInRect(CGRectMake(
      targetView.ios.frame.origin.x - 10,
      targetView.ios.frame.origin.y - 10,
      targetView.ios.frame.size.width + 20,
      targetView.ios.frame.size.height + 20
    ));

    path.appendPath(circlePath.bezierPathByReversingPath());
    maskLayer.path = path.CGPath;
    overlay.layer.mask = maskLayer;

    const label = UILabel.alloc().initWithFrame(CGRectMake(
      targetView.ios.frame.origin.x,
      targetView.ios.frame.origin.y + targetView.ios.frame.size.height + 10,
      200, 50
    ));
    label.text = caption;
    label.textColor = UIColor.whiteColor;
    label.textAlignment = NSTextAlignment.Center;
    controller.view.addSubview(label);

    // Add a tap gesture to remove the coachmark
    const tapGesture = UITapGestureRecognizer.alloc().initWithTargetAction(this, "removeCoachMark:");
    overlay.addGestureRecognizer(tapGesture);
    overlay.userInteractionEnabled = true;
  }

  removeCoachMark(sender: any) {
    sender.view.removeFromSuperview();
  }
}
