import joblib


def save_model(model, model_path):
    """
    Save trained model to disk.
    """
    joblib.dump(model, model_path)
    print(f"Model saved successfully at {model_path}")


def load_model(model_path):
    """
    Load trained model from disk.
    """
    model = joblib.load(model_path)
    return model