# # This is test for a local LLM model using the Hugging Face Transformers library.
#
# from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
# import os
#
# MODEL_NAME = "meta-llama/Llama-3.2-1B-Instruct"
# TOKEN = os.getenv("HUGGINGFACE_HUB_TOKEN")
#
# _tokenizer = None
# _model = None
# _pipeline = None
#
# def get_llama_pipeline():
#     global _tokenizer, _model, _pipeline
#     if _pipeline is None:
#         print(f"[LLM] Loading model {MODEL_NAME}...")
#         _tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME, token=TOKEN)
#         _model = AutoModelForCausalLM.from_pretrained(
#             MODEL_NAME,
#             token=TOKEN,
#             device_map=None
#         )
#         _pipeline = pipeline(
#             "text-generation",
#             model=_model,
#             tokenizer=_tokenizer,
#             device=-1,
#             pad_token_id = _tokenizer.eos_token_id
#         )
#         print("[LLM] Model loaded successfully.")
#     return _pipeline
