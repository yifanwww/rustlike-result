#[cfg(test)]
mod tests {
    use serde::{Deserialize, Serialize};

    #[test]
    fn it_converts_result_to_externally_tagged_json() -> serde_json::Result<()> {
        let result1: Result<i32, &str> = Ok(1);
        let result2: Result<i32, &str> = Err("Some error message");
        let result3: Result<Option<i32>, Option<&str>> = Ok(Some(1));
        let result4: Result<Option<i32>, Option<&str>> = Ok(None);
        let result5: Result<Option<i32>, Option<&str>> = Err(None);

        let json1 = serde_json::to_string(&result1)?;
        let json2 = serde_json::to_string(&result2)?;
        let json3 = serde_json::to_string(&result3)?;
        let json4 = serde_json::to_string(&result4)?;
        let json5 = serde_json::to_string(&result5)?;

        assert_eq!(json1.as_str(), "{\"Ok\":1}");
        assert_eq!(json2.as_str(), "{\"Err\":\"Some error message\"}");
        assert_eq!(json3.as_str(), "{\"Ok\":1}");
        assert_eq!(json4.as_str(), "{\"Ok\":null}");
        assert_eq!(json5.as_str(), "{\"Err\":null}");

        Ok(())
    }

    #[test]
    fn it_converts_externally_tagged_json_to_result() -> serde_json::Result<()> {
        let str1 = "{\"Ok\":1}";
        let str2 = "{\"Err\":\"Some error message\"}";
        let str3 = "{\"Ok\":1}";
        let str4 = "{\"Ok\":null}";
        let str5 = "{\"Err\":null}";

        let result1: Result<i32, &str> = serde_json::from_str(str1)?;
        let result2: Result<i32, &str> = serde_json::from_str(str2)?;
        let result3: Result<Option<i32>, Option<&str>> = serde_json::from_str(str3)?;
        let result4: Result<Option<i32>, Option<&str>> = serde_json::from_str(str4)?;
        let result5: Result<Option<i32>, Option<&str>> = serde_json::from_str(str5)?;

        assert_eq!(result1, Ok(1));
        assert_eq!(result2, Err("Some error message"));
        assert_eq!(result3, Ok(Some(1)));
        assert_eq!(result4, Ok(None));
        assert_eq!(result5, Err(None));

        Ok(())
    }

    #[derive(Serialize, Deserialize)]
    #[serde(remote = "Result", tag = "type", content = "value")]
    enum ResultDef<T, E> {
        Ok(T),
        Err(E),
    }

    #[derive(Debug, PartialEq, Serialize, Deserialize)]
    struct ResultTest {
        #[serde(with = "ResultDef")]
        result: Result<i32, String>,
    }

    #[derive(Debug, PartialEq, Serialize, Deserialize)]
    struct ResultTestOption {
        #[serde(with = "ResultDef")]
        result: Result<Option<i32>, Option<String>>,
    }

    #[test]
    fn it_converts_result_to_adjacent_tagged_json() -> serde_json::Result<()> {
        let result1 = ResultTest { result: Ok(1) };
        let result2 = ResultTest {
            result: Err("Some error message".to_string()),
        };
        let result3 = ResultTestOption {
            result: Ok(Some(1)),
        };
        let result4 = ResultTestOption { result: Ok(None) };
        let result5 = ResultTestOption { result: Err(None) };

        let json1 = serde_json::to_string(&result1)?;
        let json2 = serde_json::to_string(&result2)?;
        let json3 = serde_json::to_string(&result3)?;
        let json4 = serde_json::to_string(&result4)?;
        let json5 = serde_json::to_string(&result5)?;

        assert_eq!(json1.as_str(), "{\"result\":{\"type\":\"Ok\",\"value\":1}}");
        assert_eq!(
            json2.as_str(),
            "{\"result\":{\"type\":\"Err\",\"value\":\"Some error message\"}}"
        );
        assert_eq!(json3.as_str(), "{\"result\":{\"type\":\"Ok\",\"value\":1}}");
        assert_eq!(
            json4.as_str(),
            "{\"result\":{\"type\":\"Ok\",\"value\":null}}"
        );
        assert_eq!(
            json5.as_str(),
            "{\"result\":{\"type\":\"Err\",\"value\":null}}"
        );

        Ok(())
    }

    #[test]
    fn it_converts_adjacent_tagged_json_to_result() -> serde_json::Result<()> {
        let str1 = "{\"result\":{\"type\":\"Ok\",\"value\":1}}";
        let str2 = "{\"result\":{\"type\":\"Err\",\"value\":\"Some error message\"}}";
        let str3 = "{\"result\":{\"type\":\"Ok\",\"value\":1}}";
        let str4 = "{\"result\":{\"type\":\"Ok\",\"value\":null}}";
        let str5 = "{\"result\":{\"type\":\"Err\",\"value\":null}}";

        let result1: ResultTest = serde_json::from_str(str1)?;
        let result2: ResultTest = serde_json::from_str(str2)?;
        let result3: ResultTestOption = serde_json::from_str(str3)?;
        let result4: ResultTestOption = serde_json::from_str(str4)?;
        let result5: ResultTestOption = serde_json::from_str(str5)?;

        assert_eq!(result1, ResultTest { result: Ok(1) });
        assert_eq!(
            result2,
            ResultTest {
                result: Err("Some error message".to_string()),
            }
        );
        assert_eq!(
            result3,
            ResultTestOption {
                result: Ok(Some(1)),
            }
        );
        assert_eq!(result4, ResultTestOption { result: Ok(None) });
        assert_eq!(result5, ResultTestOption { result: Err(None) });

        Ok(())
    }
}
