from django.forms import ModelForm, Textarea
from strain_review.models import Review

class ReviewForm(ModelForm):
    class Meta:
        model = Review
        fields = [ 'rating', 'comment']
        widgets = {
            'comment': Textarea(attrs={'cols': 40, 'rows': 15})
        }
