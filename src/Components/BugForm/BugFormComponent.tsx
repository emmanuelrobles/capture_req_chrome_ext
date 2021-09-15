import React from 'react';
import "./BugFromComponent.scss"

const BugFormComponent = () => {
    return (
        <div className="bug_from_component_container">
            <form>
                <div>
                    <label>
                        Name:
                        <input type="text" name="name" />
                    </label>
                    <label>
                        Reporter:
                        <input type="text" name="reporter" />
                    </label>
                </div>
                <div>
                    <label>
                        Bug overview:
                        <input type="text" name="overview" />
                    </label>
                    <label>
                        URL:
                        <input type="text" name="url" />
                    </label>
                </div>
                <div>
                    <label>
                        OS:
                        <input type="text" name="os" />
                    </label>
                    <label>
                        Browser:
                        <input type="text" name="browser" />
                    </label>
                </div>
                <div>
                    <label>
                        Steps to reproduce:
                        <input type="text" name="steps" />
                    </label>
                    <label>
                        Expected result:
                        <input type="text" name="expected_result" />
                    </label>
                    <label>
                        Actual result:
                        <input type="text" name="actual_result" />
                    </label>
                    <label>
                        Description:
                        <input type="text" name="Description" />
                    </label>
                </div>
                <div>
                    <label>
                        Notes:
                        <input type="text" name="notes" />
                    </label>
                </div>
                <input type="submit" value="Submit" />
            </form>
        </div>
    );
};

export default BugFormComponent;
