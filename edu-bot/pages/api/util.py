import subprocess
import pandas as pd
import torch
import torch.nn as nn
from torch.nn.utils.rnn import pad_sequence, pack_padded_sequence
from torchtext.data.utils import get_tokenizer
from torchtext.vocab import build_vocab_from_iterator
from sklearn.model_selection import train_test_split

def check_code_quality(file_path):
    pylint_args = [
        'pylint',
        '--disable=E0401, C0114, C0304',  # Disable import-error check
        file_path
    ]
    result = subprocess.run(pylint_args, capture_output=True, text=True)
    # print(str(result.stdout))
    return result.stdout

## Question Classification
df = pd.read_csv("../../public/questions_labels.csv")
train_df, temp_df = train_test_split(df, test_size=0.2, random_state=42)
val_df, test_df = train_test_split(temp_df, test_size=0.5, random_state=42)

tokenizer = get_tokenizer('basic_english')
def yield_tokens(data_iter):
    for text in data_iter:
        yield tokenizer(text)
vocab = build_vocab_from_iterator(yield_tokens(train_df['Question']), specials=["<unk>"])
vocab.set_default_index(vocab["<unk>"])

# define model
class TextClassifier(nn.Module):
    def __init__(self, vocab_size, embed_dim, hidden_dim, num_classes):
        super(TextClassifier, self).__init__()
        self.embedding = nn.Embedding(vocab_size, embed_dim)
        self.lstm = nn.LSTM(embed_dim, hidden_dim, batch_first=True)
        self.fc = nn.Linear(hidden_dim, num_classes)

    def forward(self, text, text_lengths):
        embedded = self.embedding(text)
        packed_embedded = pack_padded_sequence(embedded, text_lengths.cpu(), batch_first=True, enforce_sorted=False)
        packed_output, (hidden, _) = self.lstm(packed_embedded)
        out = self.fc(hidden[-1])
        return out
model = TextClassifier(len(vocab), embed_dim=100, hidden_dim=128, num_classes=2)
model.load_state_dict(torch.load("../../public/question_classifier_state_dict.pth", map_location=torch.device('cpu')))

def predict_question(question):
    model.eval()
    with torch.no_grad():
        tokenized_question = [vocab[token] for token in tokenizer(question)]
        input_tensor = torch.tensor(tokenized_question, dtype=torch.int64).unsqueeze(0)
        length_tensor = torch.tensor([len(tokenized_question)], dtype=torch.int64)
        output = model(input_tensor, length_tensor)
        _, predicted = torch.max(output, 1)
        return predicted.item()
