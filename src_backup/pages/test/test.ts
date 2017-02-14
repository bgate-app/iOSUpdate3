import { Component } from '@angular/core';
import { NavController, AlertController, Events } from 'ionic-angular';
import { StreamPlugin } from '../../providers/stream-plugin';

export class Filter {
  name: string;
  id: number;
  preview: string;
}
@Component({
  selector: 'page-test',
  templateUrl: 'test.html'
})
export class TestPage {
  mSelected: number = 0;
  filters: Array<Filter> = [
    { id: 0, name: "SkinWhiten", preview: "assets/filters/beauty.png" },
    { id: 1, name: "Beauty", preview: "assets/filters/beauty.png" },
    { id: 2, name: "WhiteCat", preview: "assets/filters/whitecat.png" },
    { id: 3, name: "Fairy Tale", preview: "assets/filters/fairytale.png" },
    { id: 4, name: "BlackCat", preview: "assets/filters/blackcat.png" },
    { id: 5, name: "Romance", preview: "assets/filters/romance.png" },
    { id: 6, name: "Sakura", preview: "assets/filters/sakura.png" },
    { id: 7, name: "Amaro", preview: "assets/filters/amoro.jpg" },
    { id: 8, name: "Walden", preview: "assets/filters/walden.jpg" },
    { id: 9, name: "Antique", preview: "assets/filters/antique.png" },
    { id: 10, name: "Calm", preview: "assets/filters/calm.png" },
    { id: 11, name: "Brannan", preview: "assets/filters/brannan.jpg" },
    { id: 12, name: "Brooklyn", preview: "assets/filters/brooklyn.jpg" },
    { id: 13, name: "EarlyBird", preview: "assets/filters/earlybird.jpg" },
    { id: 14, name: "Freud", preview: "assets/filters/freud.jpg" },
    { id: 15, name: "Hefe", preview: "assets/filters/hefe.jpg" },
    { id: 16, name: "Hudson", preview: "assets/filters/hudson.jpg" },
    { id: 17, name: "Inkwell", preview: "assets/filters/inkwell.jpg" },
    { id: 18, name: "Kevin", preview: "assets/filters/kevin.jpg" },
    { id: 19, name: "Lomo", preview: "assets/filters/lomo.jpg" },
    { id: 20, name: "N1977", preview: "assets/filters/1977.jpg" },
    { id: 21, name: "Nashville", preview: "assets/filters/nashville.jpg" },
    { id: 22, name: "Pixar", preview: "assets/filters/piaxr.jpg" },
    { id: 23, name: "Rise", preview: "assets/filters/rise.jpg" },
    { id: 24, name: "Sierra", preview: "assets/filters/sierra.jpg" },
    { id: 25, name: "Sutro", preview: "assets/filters/sutro.jpg" },
    { id: 26, name: "Toastero", preview: "assets/filters/toastero.jpg" },
    { id: 27, name: "Valencia", preview: "assets/filters/valencia.jpg" },
    { id: 28, name: "Xproii", preview: "assets/filters/walden.jpg" },
    { id: 29, name: "Evergreen", preview: "assets/filters/warm.png" },
    { id: 30, name: "Healthy", preview: "assets/filters/healthy.png" },
    { id: 31, name: "Cool", preview: "assets/filters/cool.png" },
    { id: 32, name: "Emerald", preview: "assets/filters/emerald.png" },
    { id: 33, name: "Latte", preview: "assets/filters/latte.png" },
    { id: 34, name: "Warm", preview: "assets/filters/warm.png" },
    { id: 35, name: "Tender", preview: "assets/filters/tender.png" },
    { id: 36, name: "Sweets", preview: "assets/filters/sweets.png" },
    { id: 37, name: "Nostalgia", preview: "assets/filters/nostalgia.png" },
    { id: 38, name: "Sunrise", preview: "assets/filters/sunrise.png" },
    { id: 39, name: "Sunset", preview: "assets/filters/sunset.png" },
    { id: 40, name: "Crayon", preview: "assets/filters/crayon.jpg" },
    { id: 41, name: "Sketch", preview: "assets/filters/sketch.png" },

  ];
  constructor(
    public navCtrl: NavController,
    private alertCtrl: AlertController,
    private events: Events,
    private mStreamPlugin: StreamPlugin) {
  }


  ionViewDidEnter() {

  }


  //==========================
  VIEW_NONE: number = 0;
  VIEW_FILTER: number = 1;

  mView: number = this.VIEW_FILTER;
  mAudioEnable: boolean = true;
  onClickShowView(type) {
    this.mView = type;
  }
  onClickToggleAudio() {
    this.mAudioEnable = !this.mAudioEnable;
    console.log(this.mAudioEnable);

  }
  onClickSelectFilter(id: number) {
    this.mSelected = id;
  }


}
