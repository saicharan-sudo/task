import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TopBarComponent } from './top-bar/top-bar.component';
import { CounterComponent } from './counter/counter.component';
import { WeatherComponent } from './weather/weather.component';

const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "/navigation-bar/counter" },
  {
    path: "navigation-bar", component: TopBarComponent, children: [
      { path: "counter", component: CounterComponent },
      { path: "vatavaran", component: WeatherComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
