import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '@shared';
import { MemoryRoutingModule } from './memory-routing.module';
import { BoardComponent } from './containers/board/board.component';
import { CardComponent } from '@app/memory/components/card/card.component';
import { TimeFormatPipe } from './pipes/time-format.pipe';
import { TimerComponent } from './components/timer/timer.component';
import { GameBuilderComponent } from './containers/game-builder/game-builder.component';
import { SizerDirective } from './directives/sizer.directive';
import { TextSegmentPipe } from '@app/memory/pipes/text-segment.pipe';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { StoreModule } from '@ngrx/store';
import { memoryReducer } from '@app/memory/store/memory.reducer';
import { EffectsModule } from '@ngrx/effects';
import { MemoryEffects } from '@app/memory/store/memory.effects';
import { CardInputComponent } from './components/card-input/card-input.component';
import { NgToggleModule } from 'ng-toggle-button';
import { ImageModalComponent } from './modals/image-modal/image-modal.component';
import { modals } from '@app/memory/modals';
import { ImageCropperModule } from 'ngx-image-cropper';
@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    SharedModule,
    MemoryRoutingModule,
    ToastrModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgToggleModule,
    StoreModule.forFeature('memory', memoryReducer),
    EffectsModule.forFeature([MemoryEffects]),
    FormsModule,
    ImageCropperModule,
  ],
  declarations: [
    BoardComponent,
    CardComponent,
    TimeFormatPipe,
    TextSegmentPipe,
    TimerComponent,
    GameBuilderComponent,
    SizerDirective,
    CardInputComponent,
    ImageModalComponent,
    ...modals,
  ],
  entryComponents: [...modals],
})
export class MemoryModule {}
