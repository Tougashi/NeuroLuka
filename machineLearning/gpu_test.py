import torch
print(torch.cuda.is_available())  # True kalau ada GPU bisa dipakai
print(torch.cuda.memory_allocated())  # Memory yang lagi dipakai (dalam byte)
print(torch.cuda.memory_reserved())  # Memory yang sudah dialokasikan
