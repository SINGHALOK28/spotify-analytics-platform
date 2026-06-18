FROM apache/airflow:2.8.0

# Copy requirements.txt
COPY requirements.txt /requirements.txt

# Install python dependencies as user 'airflow'
RUN pip install --no-cache-dir --user -r /requirements.txt
