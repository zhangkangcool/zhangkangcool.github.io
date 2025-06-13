<h1 align="center">C语言</h1>




```c++
void* getFileContent(char *filename, size_t *length)
{   
    char* text;
    FILE *pf = fopen(filename, "r");
    if (!pf)
    {   
        printf("open %s file failed\n", filename);
        return NULL;
    }
    fseek(pf, 0, SEEK_END);
    long lSize = ftell(pf);
    text = (char*)malloc(lSize+1);
    rewind(pf); 
    fread(text, sizeof(char), lSize, pf);
    text[lSize] = '\0';
    *length = lSize;
    fclose(pf);
    return text;
}


```

