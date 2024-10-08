import {Component, OnInit} from '@angular/core';
import {DividerModule} from "primeng/divider";
import {PanelModule} from "primeng/panel";
import {McqQuestionRequest} from "../../../../services/models/mcq-question-request";
import {FloatLabelModule} from "primeng/floatlabel";
import {InputTextareaModule} from "primeng/inputtextarea";
import {FormsModule} from "@angular/forms";
import {InputNumberModule} from "primeng/inputnumber";
import {SubjectResponse} from "../../../../services/models/subject-response";
import {VariantResponse} from "../../../../services/models/variant-response";
import {SeasonResponse} from "../../../../services/models/season-response";
import {YearResponse} from "../../../../services/models/year-response";
import {DropdownModule} from "primeng/dropdown";
import {ButtonModule} from "primeng/button";
import {NgForOf, NgIf} from "@angular/common";
import {MultipleChoiceQuestionsService} from "../../../../services/services/multiple-choice-questions.service";
import {ERROR_MESSAGES} from "../../../../../error-message";
import {
  SelectQuestionVariantDropdownComponent
} from "../select-question-variant-dropdown/select-question-variant-dropdown.component";
import {
  SelectQuestionSeasonDropdownComponent
} from "../select-question-season-dropdown/select-question-season-dropdown.component";
import {
  SelectQuestionSubjectDropdownComponent
} from "../select-question-subject-dropdown/select-question-subject-dropdown.component";
import {
  SelectedQuestionYearDropdownComponent
} from "../selected-question-year-dropdown/selected-question-year-dropdown.component";
import {CardModule} from "primeng/card";
import {MathJaxParagraphComponent} from "../math-jax-paragraph/math-jax-paragraph.component";
import {QuestionIdSaveService} from "../../../../services/shared/questIdSave/questionIdSave.service";
import {
  McqCommunicationServiceService
} from "../../../../services/mcq-communication-service/mcq-communication-service.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-add-mcq-question-panel',
  standalone: true,
  imports: [
    DividerModule,
    PanelModule,
    FloatLabelModule,
    InputTextareaModule,
    FormsModule,
    InputNumberModule,
    DropdownModule,
    ButtonModule,
    NgForOf,
    NgIf,
    SelectQuestionVariantDropdownComponent,
    SelectQuestionSeasonDropdownComponent,
    SelectQuestionSubjectDropdownComponent,
    SelectedQuestionYearDropdownComponent,
    CardModule,
    MathJaxParagraphComponent
  ],
  templateUrl: './add-mcq-question-panel.component.html',
  styleUrl: './add-mcq-question-panel.component.scss'
})
export class AddMcqQuestionPanelComponent implements OnInit{
  errorMsg: string[] = [];
  mcqQuestionRequest: McqQuestionRequest = {
    id: 0,
    mcqQuestionDescription: '',
    mcqQuestionNumOnOriginalPaper: 0,
    seasonId: 0,
    subjectId: 0,
    variantId: 0,
    yearId: 0
  }

  // Variables with selected data
  selectedSeason: SeasonResponse | undefined;
  selectedSubject: SubjectResponse | undefined;
  selectedVariant: VariantResponse | undefined;
  selectedYear: YearResponse | undefined;

  // SavedEntities
  public questionDescription: string = "CaCO\\(_3\\)(s) + 2HCl(aq) → CaCl\\(_2\\)(aq) + CO\\(_2\\)(g) + H\\(_2\\)O(l)";
  private resetSubscription!: Subscription;

  constructor(
    private mcqQuestionService: MultipleChoiceQuestionsService,
    private questionIdSave: QuestionIdSaveService,
    private mcqCommunicationService: McqCommunicationServiceService,
  ) {
  }

  ngOnInit(): void {
    this.resetSubscription = this.mcqCommunicationService.resetOptions$.subscribe(() => {
      this.resetMcqQuestionPanel();
    })
  }

  // Get the selected variant from variant dropdown component
  handleVariantSelected(variant: VariantResponse | undefined) {
    this.selectedVariant = variant;
  }
  // Get the selected season from season dropdown component
  handleSeasonSelected(season: SeasonResponse | undefined) {
    this.selectedSeason = season;
  }
  // Get the selected subject from the subject dropdown component
  handleSubjectSelected(subject: SubjectResponse | undefined) {
    this.selectedSubject = subject;
  }
  // Get the selected year from the year dropdown component
  handleYearSelected(year: YearResponse | undefined) {
    this.selectedYear = year;
  }

  saveQuestion() {
    this.errorMsg = [];
    if (this.inputIsValid()) {
      // Attach the id to the mcqQuestionRequest
      this.addIdsToMcqRequest();
      // Create the question
      this.mcqQuestionService.createMcqQuestion({
        body: this.mcqQuestionRequest
      }).subscribe({
        next: (res) => {
          this.questionIdSave.setSavedQuestionId(res);
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
  }

  private inputIsValid() {
    let isValid: boolean = true
    if (this.selectedYear == undefined) {
      this.errorMsg.push("Year is required.");
      isValid = false;
    }
    if (this.selectedVariant == undefined) {
      this.errorMsg.push("Variant is required.");
      isValid = false;
    }
    if (this.selectedSubject == undefined) {
      this.errorMsg.push("Subject is required.")
      isValid = false;
    }
    if (this.selectedSeason == undefined) {
      this.errorMsg.push("Season is required.")
      isValid = false;
    }
    if (this.mcqQuestionRequest.mcqQuestionNumOnOriginalPaper < 1
    || this.mcqQuestionRequest.mcqQuestionNumOnOriginalPaper > 40) {
      this.errorMsg.push("The number on original question should be between 1 and 40 inclusive.")
      isValid = false;
    }
    return isValid;
  }

  private addIdsToMcqRequest() {
    // Assign default value of 0 if selectedSeason is null or undefined
    this.mcqQuestionRequest.seasonId = this.selectedSeason?.id ?? 0;
    this.mcqQuestionRequest.yearId = this.selectedYear?.id ?? 0;
    this.mcqQuestionRequest.variantId = this.selectedVariant?.id ?? 0;
    this.mcqQuestionRequest.subjectId = this.selectedSubject?.id?? 0;
  }

  onQuestionDescriptionChange(questionDescription: string) {
    this.questionDescription = questionDescription;
  }

  private resetMcqQuestionPanel() {
    this.mcqQuestionRequest.mcqQuestionNumOnOriginalPaper = 0;
    this.mcqQuestionRequest.mcqQuestionDescription = '';
  }
}
