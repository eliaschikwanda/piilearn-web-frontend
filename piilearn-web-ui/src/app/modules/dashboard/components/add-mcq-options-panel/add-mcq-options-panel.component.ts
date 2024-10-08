import {Component, OnInit} from '@angular/core';
import {DividerModule} from "primeng/divider";
import {PanelModule} from "primeng/panel";
import {NgForOf, NgIf} from "@angular/common";
import {McqOptionRequest} from "../../../../services/models/mcq-option-request";
import {MultipleChoiceOptionsService} from "../../../../services/services/multiple-choice-options.service";
import {FloatLabelModule} from "primeng/floatlabel";
import {PaginatorModule} from "primeng/paginator";
import { InputTextareaModule } from 'primeng/inputtextarea';
import {InputTextModule} from "primeng/inputtext";
import {Button} from "primeng/button";
import {CardModule} from "primeng/card";
import {MathJaxParagraphComponent} from "../math-jax-paragraph/math-jax-paragraph.component";
import {QuestionIdSaveService} from "../../../../services/shared/questIdSave/questionIdSave.service";
import {ERROR_MESSAGES} from "../../../../../error-message";
import {Subscription} from "rxjs";
import {AddAnswerToMcqPanelComponent} from "../add-answer-to-mcq-panel/add-answer-to-mcq-panel.component";
import {
  McqCommunicationServiceService
} from "../../../../services/mcq-communication-service/mcq-communication-service.service";
import {McqOptionFrontend} from "../../../../services/frontend-models/mcq-option-frontend";

@Component({
  selector: 'app-add-mcq-options-panel',
  standalone: true,
  imports: [
    DividerModule,
    PanelModule,
    NgForOf,
    NgIf,
    FloatLabelModule,
    PaginatorModule,
    InputTextareaModule,
    InputTextModule,
    Button,
    CardModule,
    MathJaxParagraphComponent,
    AddAnswerToMcqPanelComponent,
  ],
  templateUrl: './add-mcq-options-panel.component.html',
  styleUrl: './add-mcq-options-panel.component.scss'
})
export class AddMcqOptionsPanelComponent implements OnInit{
  errorMsg: string[] = [];
  mcqQuestionOptionIds: number[] = [];
  optionDescription: string = "CH\\(_{3}\\,^{+}\\)";
  mcqOptionRequest: McqOptionRequest = {
    id: 0,
    optionRep: "",
    optionDescription: "",
    mcqQuestionId: 0
  }

  mcqOptionFrontend: McqOptionFrontend = {};
  private questionIdSubscription!: Subscription;
  private resetSubscription!: Subscription ;

  constructor(
    private mcqOptionService: MultipleChoiceOptionsService,
    private questionIdSave: QuestionIdSaveService,
    private mcqCommunicationService: McqCommunicationServiceService
  ) {
  }

  // Put all the code you want after Angular is done creating components
  ngOnInit(): void {
    this.questionIdSubscription = this.questionIdSave.questionId$.subscribe(id => {
      this.mcqOptionRequest.mcqQuestionId = id;
    });

    this.resetSubscription = this.mcqCommunicationService.resetOptions$.subscribe(() => {
      this.resetMcqOptionPanel();
    })
  }

  ngOnDestroy(): void {
    if (this.questionIdSubscription) {
      this.questionIdSubscription.unsubscribe();
    }

    if (this.resetSubscription) {
      this.resetSubscription.unsubscribe();
    }
  }

  saveOption() {
    this.errorMsg = []
    // Input will be validated by the backend
    this.mcqOptionService.createMcqOption({
      body: this.mcqOptionRequest
    }).subscribe({
      next: (res) => {
        this.addOrUpdateOption(res);
        this.mcqQuestionOptionIds.push(res);
        // Clear the fields after save
        this.mcqOptionRequest.optionDescription = '';
        this.mcqOptionRequest.optionRep = '';
      },
      error: (err) => {
        if (err.error.validationErrors) {
          err.error.validationErrors.forEach((msg: string ) => {
            this.errorMsg.push(ERROR_MESSAGES[msg] || msg);
          });
        } else {
          this.errorMsg.push(err.error.error);
        }
      }
    })
  }

  onQuestionOptionChange(optionDescription: string) {
    this.optionDescription = optionDescription;
  }

  addOrUpdateOption(res: number) {
    this.mcqOptionFrontend[res] = {
      mcqOptionRep: this.mcqOptionRequest.optionRep,
      mcqOptionDes: this.mcqOptionRequest.optionDescription,
    };
  }

  private resetMcqOptionPanel() {
    this.mcqOptionRequest.mcqQuestionId = 0;
    this.mcqOptionFrontend = {};
    this.mcqQuestionOptionIds = [];
  }
}
