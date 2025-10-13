"""
Verification Script for WBP_PaperworkForm Widget
Checks that all required components are properly named and configured

This script helps verify that the Blueprint widget matches the C++ class requirements.
Run this after creating the widget in Unreal Editor to ensure all bindings are correct.
"""

import json
import os

class WidgetVerifier:
    def __init__(self):
        self.errors = []
        self.warnings = []
        self.successes = []

        # Required component names from C++ header
        self.required_text_boxes = [
            "FullNameTextBox",
            "SSNTextBox",
            "ExistingWhileDrivingTextBox",
            "Essay500WordsTextBox",
            "VehicleColorTextBox",
            "HeartbeatsTextBox",
            "DidYouBreatheTextBox",
            "MaidenNamesTextBox",
            "OfficerFavoriteColorTextBox",
            "SignatureTextBox"
        ]

        self.required_checkboxes = [
            "CheckBox47B",
            "AcknowledgeGuiltyCheckBox",
            "ConsentPaperworkCheckBox",
            "Form30SecondsCheckBox",
            "SurrenderSoulCheckBox",
            "NotAgreeCheckBox",
            "CertifyCheckedCheckBox",
            "AcknowledgeCheckingCheckBox"
        ]

        self.required_components = [
            "RootCanvas",
            "FormScrollBox",
            "SubmitButton",
            "ErrorMessageText",
            "FormTitleText"
        ]

    def verify_structure(self):
        """Verify the widget structure matches requirements"""
        print("=" * 80)
        print("WBP_PAPERWORK FORM WIDGET VERIFICATION")
        print("=" * 80)
        print()

        # Load the JSON structure
        spec_path = os.path.join(os.path.dirname(__file__), '..', 'WBP_PaperworkForm_Structure.json')

        try:
            with open(spec_path, 'r') as f:
                spec = json.load(f)
            self.successes.append(f"Successfully loaded specification from {spec_path}")
        except FileNotFoundError:
            self.errors.append(f"Could not find specification file: {spec_path}")
            return
        except json.JSONDecodeError as e:
            self.errors.append(f"Invalid JSON in specification file: {e}")
            return

        # Verify components
        self._verify_text_boxes(spec)
        self._verify_checkboxes(spec)
        self._verify_other_components(spec)
        self._verify_validation_logic(spec)

        # Print results
        self._print_results()

    def _verify_text_boxes(self, spec):
        """Verify all text boxes are defined"""
        print("\n[1/4] Verifying Text Boxes...")

        spec_text_fields = [field['name'] for field in spec.get('text_fields', [])]

        for required_box in self.required_text_boxes:
            if required_box in spec_text_fields:
                self.successes.append(f"[OK] Text box '{required_box}' found in specification")
            else:
                self.errors.append(f"[ERROR] Missing text box '{required_box}' in specification")

        # Check for extras
        for spec_box in spec_text_fields:
            if spec_box not in self.required_text_boxes:
                self.warnings.append(f"[WARN] Unexpected text box '{spec_box}' in specification")

    def _verify_checkboxes(self, spec):
        """Verify all checkboxes are defined"""
        print("[2/4] Verifying Checkboxes...")

        spec_checkboxes = [cb['name'] for cb in spec.get('checkboxes', [])]

        for required_cb in self.required_checkboxes:
            if required_cb in spec_checkboxes:
                self.successes.append(f"[OK] Checkbox '{required_cb}' found in specification")
            else:
                self.errors.append(f"[ERROR] Missing checkbox '{required_cb}' in specification")

        # Check for extras
        for spec_cb in spec_checkboxes:
            if spec_cb not in self.required_checkboxes:
                self.warnings.append(f"[WARN] Unexpected checkbox '{spec_cb}' in specification")

    def _verify_other_components(self, spec):
        """Verify other required components"""
        print("[3/4] Verifying Other Components...")

        # Check root
        root_name = spec.get('root', {}).get('name')
        if root_name == 'RootCanvas':
            self.successes.append(f"[OK] Root canvas correctly named")
        else:
            self.errors.append(f"[ERROR] Root canvas not found or incorrectly named")

        # Check buttons
        buttons = [btn['name'] for btn in spec.get('buttons', [])]
        if 'SubmitButton' in buttons:
            self.successes.append(f"[OK] Submit button found")
        else:
            self.errors.append(f"[ERROR] Submit button missing")

        # Check text blocks
        text_blocks = [tb['name'] for tb in spec.get('text_blocks', [])]
        for required_tb in ['FormTitleText', 'ErrorMessageText']:
            if required_tb in text_blocks:
                self.successes.append(f"[OK] Text block '{required_tb}' found")
            else:
                self.errors.append(f"[ERROR] Text block '{required_tb}' missing")

    def _verify_validation_logic(self, spec):
        """Verify validation logic is properly defined"""
        print("[4/4] Verifying Validation Logic...")

        validation = spec.get('validation', {})

        if validation.get('strategy') == 'EVIL_CLEAR_ALL':
            self.successes.append(f"[OK] Validation strategy correctly set to EVIL_CLEAR_ALL")
        else:
            self.errors.append(f"[ERROR] Validation strategy not set or incorrect")

        timing = validation.get('timing', {})
        if timing.get('error_display_duration') == 2.0:
            self.successes.append(f"[OK] Error display duration is 2 seconds (comedic timing)")
        else:
            self.warnings.append(f"[WARN] Error display duration should be 2 seconds")

        if timing.get('success_delay_before_close') == 3.0:
            self.successes.append(f"[OK] Success delay is 3 seconds")
        else:
            self.warnings.append(f"[WARN] Success delay should be 3 seconds")

    def _print_results(self):
        """Print verification results"""
        print("\n" + "=" * 80)
        print("VERIFICATION RESULTS")
        print("=" * 80)

        if self.successes:
            print(f"\nSUCCESSES ({len(self.successes)}):")
            for success in self.successes:
                print(f"  {success}")

        if self.warnings:
            print(f"\nWARNINGS ({len(self.warnings)}):")
            for warning in self.warnings:
                print(f"  {warning}")

        if self.errors:
            print(f"\nERRORS ({len(self.errors)}):")
            for error in self.errors:
                print(f"  {error}")

        print("\n" + "=" * 80)

        if not self.errors:
            print("STATUS: ALL CHECKS PASSED")
            print("\nNext steps:")
            print("1. Open Unreal Editor")
            print("2. Navigate to Content/Blueprints/UI/")
            print("3. Create Widget Blueprint: WBP_PaperworkForm")
            print("4. Set parent class to VroomPaperworkFormWidget")
            print("5. Add all components with exact names from specification")
            print("6. Implement Blueprint events (ShowSentence, ReturnToOpenWorld, etc.)")
            print("7. Test the widget thoroughly")
        else:
            print(f"STATUS: {len(self.errors)} ERROR(S) FOUND")
            print("\nFix the errors above before proceeding with Blueprint creation.")

        print("=" * 80)


def generate_component_checklist():
    """Generate a checklist for manual Blueprint creation"""
    print("\n" + "=" * 80)
    print("BLUEPRINT CREATION CHECKLIST")
    print("=" * 80)

    checklist = [
        ("Create Widget Blueprint", "Content/Blueprints/UI/WBP_PaperworkForm"),
        ("Set parent class", "VroomPaperworkFormWidget"),
        ("Add Canvas Panel", "Name: RootCanvas, Is Variable: TRUE"),
        ("Add Scroll Box", "Name: FormScrollBox, Is Variable: TRUE"),
        ("Add Form Title", "Name: FormTitleText, Is Variable: TRUE"),
        ("Add Error Message", "Name: ErrorMessageText, Is Variable: TRUE, Hidden by default"),
        ("Add Submit Button", "Name: SubmitButton, Is Variable: TRUE"),
        ("", ""),
        ("TEXT BOXES (10 total):", "All must have 'Is Variable: TRUE'"),
        ("  1. FullNameTextBox", "Label: Full Legal Name (include maiden names...)"),
        ("  2. SSNTextBox", "Label: Social Security Number (all digits...)"),
        ("  3. ExistingWhileDrivingTextBox", "Label: Did you know you were existing..."),
        ("  4. Essay500WordsTextBox", "Label: Explain in EXACTLY 500 words... (Multi-line: TRUE)"),
        ("  5. VehicleColorTextBox", "Label: Vehicle color (be specific...)"),
        ("  6. HeartbeatsTextBox", "Label: Number of heartbeats during violation"),
        ("  7. DidYouBreatheTextBox", "Label: Did you breathe while existing..."),
        ("  8. MaidenNamesTextBox", "Label: Mother's maiden name, father's..."),
        ("  9. OfficerFavoriteColorTextBox", "Label: Favorite color of the arresting..."),
        (" 10. SignatureTextBox", "Label: Sign here (type your full name...)"),
        ("", ""),
        ("CHECKBOXES (8 total):", "All must have 'Is Variable: TRUE'"),
        ("  1. CheckBox47B", "Label: Check box 47B subsection 12..."),
        ("  2. AcknowledgeGuiltyCheckBox", "Label: I acknowledge I am guilty..."),
        ("  3. ConsentPaperworkCheckBox", "Label: I consent to excessive paperwork"),
        ("  4. Form30SecondsCheckBox", "Label: I understand this form expires..."),
        ("  5. SurrenderSoulCheckBox", "Label: I hereby surrender my soul to the DMV"),
        ("  6. NotAgreeCheckBox", "Label: I agree to not agree with myself"),
        ("  7. CertifyCheckedCheckBox", "Label: I certify this checkbox is checked"),
        ("  8. AcknowledgeCheckingCheckBox", "Label: I acknowledge checking this box..."),
        ("", ""),
        ("BLUEPRINT EVENTS:", "Implement in Event Graph"),
        ("  - ShowSentence", "Display sentence after successful submission"),
        ("  - ReturnToOpenWorld", "Close form and return to driving"),
        ("  - PlayErrorSound", "Play buzzer on validation failure"),
        ("  - PlaySubmitSound", "Play stamp sound on success"),
        ("", ""),
        ("COMPILE AND TEST", "Ensure no errors, test all validation paths")
    ]

    for i, (task, description) in enumerate(checklist, 1):
        if task == "":
            print()
        else:
            print(f"[ ] {task}")
            if description:
                print(f"    {description}")

    print("\n" + "=" * 80)


if __name__ == "__main__":
    # Run verification
    verifier = WidgetVerifier()
    verifier.verify_structure()

    # Generate checklist
    generate_component_checklist()

    print("\n")
    print("This verification is complete!")
    print("The actual .uasset file must be created manually in Unreal Editor.")
    print("Use the WBP_PaperworkForm_Blueprint_Specification.md for detailed instructions.")
