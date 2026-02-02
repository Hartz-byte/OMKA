import time

class Metrics:
    def __init__(self):
        self.latencies = []

    def record_latency(self, start):
        self.latencies.append(time.time() - start)

metrics = Metrics()
